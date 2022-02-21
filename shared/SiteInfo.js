import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Container, Text, Header, Divider } from "../components";

import { timeAgo } from "../utils";

import NavigationButton from "./NavigationButton";
import DomainItem from "./DomainItem";

const SiteInfo = (props) => {
  const [showingDomains, setShowingDomains] = useState(false);

  const site = props.sites.find((site) => site._id === props.selectedSite);
  const domains = props.domains[props.selectedSite] ?? [];

  return (
    <Container style={styles.container}>
      <Container style={styles.header}>
        <Header>{site.name}</Header>
        <NavigationButton
          style={{marginRight: 0}}
          icon={showingDomains ? "more-vertical" : "more-horizontal"}
          onPress={() => setShowingDomains(!showingDomains)}
          disabled={domains === null || domains.length === 0}
        />
      </Container>
      {site.lastPublished && (
        <Text style={{ marginTop: 8, flex: 1, flexWrap: "wrap" }}>
          Updated {timeAgo.format(new Date(site.lastPublished), "round-minute")}
        </Text>
      )}
      {domains && showingDomains && (
        <Container style={styles.content}>
          <Text
            style={{
              fontWeight: "600",
            }}
          >
            DOMAINS
          </Text>
          <Divider />
          {domains &&
            domains.map((dom) => <DomainItem {...props} key={dom.name} domain={dom} />)}
        </Container>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 6,
    marginVertical: 12,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    marginTop: 12,
    paddingTop: 12,
  },
});

export default SiteInfo;
