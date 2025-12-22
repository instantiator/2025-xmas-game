import { useContext } from "react";
import type { GameDisplayTemplate } from "../entities/data/GameDisplayData";
import { getBaseURL, getDirectoryURL, isDefined } from "../util/ObjectUtils";
import { GameContentCacheContext } from "./GameContentCacheContext";
import { GameRepositoryContext } from "./GameRepositoryContext";

export default function useContentCache() {
  const { source: repositorySource } = useContext(GameRepositoryContext);
  const { cache, setCache } = useContext(GameContentCacheContext);

  const getTemplate = async (template?: GameDisplayTemplate): Promise<GameDisplayTemplate | undefined> => {
    if (!isDefined(template)) {
      return undefined;
    }
    // first check the cache
    const cached = cache.templates.find(
      (t) => t.sourceType === template.sourceType && t.templateSource === template.templateSource,
    );

    if (isDefined(cached)) {
      return cached;
    }

    switch (template.sourceType) {
      case "embedded":
        return template;

      // convert all "relative" type sources to "url"
      case "relative":
        switch (repositorySource.type) {
          case "RemoteRepository":
            return await getTemplate({
              ...template,
              sourceType: "url",
              templateSource: new URL(template.templateSource!, getDirectoryURL(repositorySource.src)).toString(),
            });

          case "LocalRepository":
            return await getTemplate({
              ...template,
              sourceType: "url",
              templateSource: new URL(template.templateSource!, getBaseURL()).toString(),
            });

          case "RawRepository":
            throw "Raw repository does not support relative template sources";
        }
        break;

      case "url": {
        const response = await fetch(template.templateSource!);
        const text = await response.text();
        setCache((previous) => ({ ...previous, templates: [...previous.templates, { ...template, content: text }] }));
        return { ...template, content: text };
      }
    }
  };

  return { getTemplate };
}
