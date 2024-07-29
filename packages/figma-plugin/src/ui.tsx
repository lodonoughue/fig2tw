import { render } from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import React, { h } from "preact";
import { useCallback, useState } from "preact/hooks";
import "!./styles/output.css";

import { DownloadFileHandler, GenerateJsonHandler } from "./types";
import Header from "./components/Header";
import Title from "./components/Title";
import LinkContainer from "./components/LinkContainer";
import LinkGitHub from "./components/LinkGitHub";
import Step from "./components/Step";
import Button from "./components/Button";
import ButtonContainer from "./components/ButtonContainer";
import CollectionContainer from "./components/CollectionContainer";
import Collection from "./components/Collection";
import Skeleton from "./components/Skeleton";

function Plugin() {
  const [_, setOutput] = useState<string | null>(null);

  on<DownloadFileHandler>("DOWNLOAD_FILE", setOutput);

  const generateJson = useCallback(() => {
    emit<GenerateJsonHandler>("GENERATE_JSON", 3);
  }, []);

  return (
    <div
      id="fig2tw"
      className="bg-surface text-on-surface h-full flex flex-col gap-md">
      <Header>
        <Title>fig2tw</Title>
        <LinkContainer>
          <LinkGitHub href="https://github.com/lodonoughue/fig2tw" />
        </LinkContainer>
      </Header>
      <Step
        title="Step 1."
        description="Export the collections to a JSON file.">
        <CollectionContainer>
          <Collection index={1}>
            <Skeleton index={1} />
          </Collection>
          <Collection index={2}>
            <Skeleton index={2} />
          </Collection>
          <Collection index={3}>
            <Skeleton index={3} />
          </Collection>
          <Collection index={4}>
            <Skeleton index={4} />
          </Collection>
        </CollectionContainer>
        <ButtonContainer>
          <Button type="quinary">Export</Button>
        </ButtonContainer>
      </Step>
    </div>
  );
}

export default render(Plugin);
