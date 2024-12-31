import React, { useState } from "react";
import { createMessageBroker, MessageBroker } from "@common/messages";
import Header from "./components/header";
import Title from "./components/title";
import HeaderLinkContainer from "./components/header-link-container";
import Link from "./components/link";
import Layout from "./components/layout";
import TabContainer from "./components/tab-container";
import Tab from "./components/tab";
import TailwindSection from "./sections/tailwind-section";
import CssSection from "./sections/css-section";
import JsonSection from "./sections/json-section";
import { ConfigProvider } from "./contexts/config";
import Navigation from "./components/navigation";
import ConfigSection from "./sections/config-section";

const defaultBroker = createMessageBroker();

const sections = {
  Tailwind: TailwindSection,
  CSS: CssSection,
  JSON: JsonSection,
  Config: ConfigSection,
} as const;
const tabs = Object.keys(sections) as Tab[];

export default function App({
  broker = defaultBroker,
  defaultTab = "Tailwind",
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const Section = sections[activeTab];

  return (
    <ConfigProvider broker={broker}>
      <Layout>
        <Header>
          <Title>fig2tw</Title>
          <HeaderLinkContainer>
            <Link href="https://github.com/lodonoughue/fig2tw">github.com</Link>
          </HeaderLinkContainer>
        </Header>
        <Navigation>
          <TabContainer className="grow">
            {tabs.map(name => (
              <Tab
                key={name}
                isSelected={activeTab === name}
                onClick={() => setActiveTab(name)}>
                {name}
              </Tab>
            ))}
          </TabContainer>
        </Navigation>
        <Section broker={broker} />
      </Layout>
    </ConfigProvider>
  );
}

type Tab = keyof typeof sections;

interface Props {
  defaultTab?: Tab;
  broker?: MessageBroker;
}
