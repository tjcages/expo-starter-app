// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const path = require("path");

// Copy the .env.example in the root into a .env file in this folder
const envFilePath = path.resolve(__dirname, "./.env");
const env = require("dotenv").config({ path: envFilePath });
if (env.error) {
  throw new Error(
    `Unable to load the .env file from ${envFilePath}. Please copy .env.example to ${envFilePath}`
  );
}

// const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY, {
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
  appInfo: {
    // For sample support and debugging, not required for production:
    name: "checkout-subscription",
    version: "0.0.1",
  },
});

const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();
var db = admin.firestore();

exports.requestUserAuthentication = functions.https.onRequest((req, res) => {
  res.redirect(
    `https://webflow.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&response_type=code`
  );
});

exports.getCurrentAuthorization = functions.https.onRequest(
  (request, response) => {
    const code = request.query.code;

    cors(request, response, () => {
      axios
        .post("https://api.webflow.com/oauth/access_token", {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: code,
          grant_type: "authorization_code",
        })
        .then((res) => {
          const access_token = res.data.access_token;
          response.send({ token: access_token });
          // to do
        })
        .catch((error) => {
          functions.logger.error(error);
          response.send("Error you suck");
        });
    });
  }
);

exports.getUserDetails = functions.https.onRequest((request, response) => {
  const token = request.query.token;

  cors(request, response, () => {
    getCurrentAuthorizationInfo(token)
      .then((user) => {
        getUserFirestoreInfo(user.user)
          .then((firestoreUser) => {
            response.send(firestoreUser);
          })
          .catch((error) => {
            functions.logger.error(error);
            response.send("Error getting firestore user");
          });
      })
      .catch((error) => {
        functions.logger.error(error);
        response.send("Error getting current authorization");
      });
  });
});

async function getCurrentAuthorizationInfo(access_token) {
  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "accept-version": "1.0.0",
    },
  };

  return new Promise((resolve, reject) => {
    axios
      .get("https://api.webflow.com/user", config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        functions.logger.error(error);
        reject(error);
      });
  });
}

async function getUserFirestoreInfo(user) {
  return new Promise((resolve, reject) => {
    db.collection("users")
      .doc(user._id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // return the existing Firestore user
          resolve(doc.data());
        } else {
          // doc.data() will be undefined in this case
          // user doesn't exist, create one
          createFirestoreUser(user).then((newUser) => {
            resolve(newUser);
          });
        }
      })
      .catch((error) => {
        console.log("Error getting Firestore user: " + error)
        reject(error);
      });
  });
}

async function createFirestoreUser(user) {
  console.log("Creating new Firestore user")
  const ref = db.collection("users").doc(user._id);
  const newUser = {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    id: user._id,
    status: "free",
  };
  return new Promise((resolve, reject) => {
    ref
      .set(newUser)
      .then(() => {
        newUser["newUser"] = true;
        resolve(newUser);
      })
      .catch((error) => {
        functions.logger.error("Error writing document: ", error);
        reject(error);
      });
  });
}

//////// MANAGE SUBSCRIPTIONS

exports.createCheckoutSession = functions.https.onRequest(
  async (request, response) => {
    const prices = await stripe.prices.list({
      lookup_keys: [request.query.lookup_key],
      expand: ["data.product"],
    });
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: prices.data[0].id,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.DOMAIN}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/subscriptions/failed`,
    });

    response.redirect(303, session.url);
  }
);

exports.createPortalSession = functions.https.onRequest(async (request, response) => {
  const firestoreId = request.query.id
  console.log("Firestore ID: " + firestoreId)
  getUserFirestoreInfo({_id: firestoreId}).then(async (firestoreUser) => {
    console.log("User Firestore: " + firestoreUser)
    const customerId = firestoreUser.customer
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.DOMAIN}/dashboard`,
    });
  
    response.redirect(303, portalSession.url);
  })
  .catch((error) => {
    console.log("Could not retrieve Customer ID from Firestore User")
    functions.logger.error(error)
    response.send(error)
  })
})

exports.listenToSubscriptions = functions.https.onRequest(
  (request, response) => {
    functions.logger.info("Subscription webhook started");

    let data;
    let eventType;
    // Check if webhook signing is configured.
    // const endpointSecret = process.env.STRIPE_TEST_WEBHOOK_SECRET;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.rawBody,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
    let subscription;

    switch (event.type) {
      case "checkout.session.completed":
        // Payment is successful and the subscription is created.
        // You should provision the subscription and save the customer ID to your database.
        subscription = event.data.object;
        updateCustomerDetails(subscription);
        break;
      case "invoice.paid":
        // Continue to provision the subscription as payments continue to be made.
        // Store the status in your database and check when a user accesses your service.
        // This approach helps you avoid hitting rate limits.
        subscription = event.data.object;
        updateCustomerSubscription(subscription);
        break;
      case "invoice.payment_failed":
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify your customer and send them to the
        // customer portal to update their payment information.
        subscription = event.data.object;
        cancelCustomerSubscription(subscription);
        break;
      case "customer.subscription.deleted":
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify your customer and send them to the
        // customer portal to update their payment information.
        subscription = event.data.object;
        cancelCustomerSubscription(subscription);
        break;
      default:
      // Unhandled event type
    }

    response.sendStatus(200);
  }
);

const updateCustomerDetails = (subscription) => {
  const customer = subscription.customer;
  const customer_email = subscription.customer_details.email;

  var usersRef = db.collection("users");
  var query = usersRef.where("email", "==", customer_email);
  query
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        const update = {
          customer: customer,
        };
        updateFirestoreUser(doc.id, update);
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
};

const updateCustomerSubscription = (subscription) => {
  const customer = subscription.customer;
  const paymentCreated = subscription.created;
  const interval = subscription.lines.data[subscription.lines.data.length - 1].plan.interval;

  var usersRef = db.collection("users");
  var query = usersRef.where("email", "==", subscription.customer_email);
  query
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        const update = {
          status: interval,
          lastPaid: paymentCreated,
          customer: customer,
        };
        updateFirestoreUser(doc.id, update);
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
};

const cancelCustomerSubscription = (subscription) => {
  const customer = subscription.customer;
  const customer_email = subscription.customer_details.email;

  var usersRef = db.collection("users");
  var query = usersRef.where("email", "==", customer_email);
  query
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        const update = {
          status: "free"
        };
        updateFirestoreUser(doc.id, update);
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
};

const updateFirestoreUser = (userId, update) => {
  const updateRef = db.collection("users").doc(userId);
  return updateRef
    .update(update)
    .then(() => {
      console.log("Document successfully updated!");
    })
    .catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
};
