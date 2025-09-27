import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import createClient from "openapi-fetch";

import { paths as api } from "./bgm-api-client.gen";
import { paths as v0 } from "./bgm-v0-client.gen";
import {
  collectCharacterByCharacterIdAndUserIdParams,
  collectPersonByPersonIdAndUserIdParams,
  getCharacterByIdParams,
  getEpisodeByIdParams,
  getPersonByIdParams,
  getRelatedCharactersByPersonIdParams,
  getRelatedCharactersBySubjectIdParams,
  getRelatedPersonsByCharacterIdParams,
  getRelatedPersonsBySubjectIdParams,
  getRelatedSubjectsByCharacterIdParams,
  getRelatedSubjectsByPersonIdParams,
  getRelatedSubjectsBySubjectIdParams,
  getSubjectByIdParams,
  getSubjectsQueryParams,
  getUserByNameParams,
  getUserCharacterCollectionParams,
  getUserCharacterCollectionsParams,
  getUserCollectionParams,
  getUserCollectionsByUsernameParams,
  getUserCollectionsByUsernameQueryParams,
  getUserEpisodeCollectionParams,
  getUserPersonCollectionParams,
  getUserPersonCollectionsParams,
  getUserSubjectEpisodeCollectionParams,
  getUserSubjectEpisodeCollectionQueryParams,
  patchUserCollectionParams,
  patchUserSubjectEpisodeCollectionBody,
  patchUserSubjectEpisodeCollectionParams,
  postUserCollectionParams,
  putUserEpisodeCollectionParams,
  searchCharactersBody,
  searchCharactersQueryParams,
  searchPersonsBody,
  searchPersonsQueryParams,
  searchSubjectsBody,
  searchSubjectsQueryParams,
  uncollectCharacterByCharacterIdAndUserIdParams,
  uncollectPersonByPersonIdAndUserIdParams,
} from "./bgm-v0-zod.gen";
import { fetchRespWarp } from "./utils";

export const mcpServer = new McpServer({
  name: "Bangumi MCP server",
  version: "0.1.0",
});

export const api_client = createClient<api>({
  baseUrl: "https://api.bgm.tv",
  headers: { "User-Agent": "zhexin/bgm-mcp/0.1.0" },
});

export const v0_client = createClient<v0>({
  baseUrl: "https://api.bgm.tv",
  headers: { "User-Agent": "zhexin/bgm-mcp/0.1.0" },
});

/**
 * 每日放送
 */
mcpServer.tool("calendar", "获取本季度新番", async () => {
  const resp = await api_client.GET("/calendar");
  const fdata = resp.data?.map((d) =>
    d.items?.map((d) => {
      // 过滤一些无用信息以降低 token 消耗
      const { images, ...other } = d;
      return other;
    })
  );
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(fdata ?? resp.error),
      },
    ],
  };
  // return fetchRespWarp(resp);
});

/**
 * 条目
 */
mcpServer.tool(
  "search-subjects",
  "根据关键词检索动漫条目",
  {
    queryParams: searchSubjectsQueryParams,
    bodyParams: searchSubjectsBody,
  },
  async ({ queryParams, bodyParams }) => {
    v0_client.POST("/v0/search/subjects");
    const resp = await v0_client.POST("/v0/search/subjects", {
      params: { query: { limit: queryParams.limit ?? 3, ...queryParams } },
      body: bodyParams,
    });
    const fdata = resp.data?.data.map((d) => {
      // 过滤一些无用信息以降低 token 消耗
      const { infobox, tags, rating, images, ...other } = d;
      return other;
    });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(fdata ?? resp.error),
        },
      ],
    };
    // return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "list-subjects",
  "浏览条目",
  {
    queryParams: getSubjectsQueryParams,
  },
  async ({ queryParams }) => {
    const resp = await v0_client.GET("/v0/subjects", {
      params: { query: queryParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-subject",
  "获取条目的详细信息",
  { pathParams: getSubjectByIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.GET("/v0/subjects/{subject_id}", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-subject-persons",
  "Get Subject Persons",
  { pathParams: getRelatedPersonsBySubjectIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.GET("/v0/subjects/{subject_id}/persons", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-subject-characters",
  "Get Subject Characters",
  { pathParams: getRelatedCharactersBySubjectIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.GET("/v0/subjects/{subject_id}/characters", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-subject-relations",
  "Get Subject Relations",
  { pathParams: getRelatedSubjectsBySubjectIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.GET("/v0/subjects/{subject_id}/subjects", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

/**
 * 章节
 */
mcpServer.tool(
  "get-episodes",
  "Get Episodes",
  { queryParams: getRelatedSubjectsBySubjectIdParams },
  async ({ queryParams }) => {
    const resp = await v0_client.GET("/v0/episodes", {
      params: { query: queryParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-episode",
  "Get Episode",
  { pathParams: getEpisodeByIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.GET("/v0/episodes/{episode_id}", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

/**
 * 角色
 */
mcpServer.tool(
  "search-characters",
  "根据关键词检索角色",
  {
    queryParams: searchCharactersQueryParams,
    bodyParams: searchCharactersBody,
  },
  async ({ queryParams, bodyParams }) => {
    const resp = await v0_client.POST("/v0/search/characters", {
      params: { query: queryParams },
      body: bodyParams,
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-character",
  "获取角色的详细信息",
  { pathParams: getCharacterByIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.GET("/v0/characters/{character_id}", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-character-related-subjects",
  "get character related subjects",
  { pathParams: getRelatedSubjectsByCharacterIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.GET("/v0/characters/{character_id}/subjects", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-character-related-persons",
  "get character related persons",
  { pathParams: getRelatedPersonsByCharacterIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.GET("/v0/characters/{character_id}/persons", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "collect-character",
  "collect character for current user",
  { pathParams: collectCharacterByCharacterIdAndUserIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.POST("/v0/characters/{character_id}/collect", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "uncollect-character",
  "uncollect character for current user",
  { pathParams: uncollectCharacterByCharacterIdAndUserIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.DELETE(
      "/v0/characters/{character_id}/collect",
      {
        params: { path: pathParams },
      }
    );
    return fetchRespWarp(resp);
  }
);

/**
 * 人物
 */
mcpServer.tool(
  "search-persons",
  "根据关键词检索人物",
  {
    queryParams: searchPersonsQueryParams,
    bodyParams: searchPersonsBody,
  },
  async ({ queryParams, bodyParams }) => {
    const resp = await v0_client.POST("/v0/search/persons", {
      params: { query: queryParams },
      body: bodyParams,
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-person",
  "获取角色的详细信息",
  { pathParams: getPersonByIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.GET("/v0/persons/{person_id}", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-person-related-subjects",
  "get person related subjects",
  { pathParams: getRelatedSubjectsByPersonIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.GET("/v0/persons/{person_id}/subjects", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-person-related-characters",
  "get person related characters",
  { pathParams: getRelatedCharactersByPersonIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.GET("/v0/persons/{person_id}/characters", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "collect-person",
  "collect person for current user",
  { pathParams: collectPersonByPersonIdAndUserIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.POST("/v0/persons/{person_id}/collect", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "uncollect-person",
  "uncollect person for current user",
  { pathParams: uncollectPersonByPersonIdAndUserIdParams },
  async ({ pathParams }) => {
    const resp = await v0_client.DELETE("/v0/persons/{person_id}/collect", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

/**
 * 用户
 */
mcpServer.tool(
  "get-user-by-name",
  "获取用户信息，如用户名，ID 等",
  { pathParams: getUserByNameParams },
  async ({ pathParams }) => {
    const resp = await v0_client.GET("/v0/users/{username}", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool("about-me", "获取本人的用户信息", async () => {
  const resp = await v0_client.GET("/v0/me");
  return fetchRespWarp(resp);
});

/**
 * 收藏
 */
mcpServer.tool(
  "get-user-collections",
  "获取用户的收藏",
  {
    pathParams: getUserCollectionsByUsernameParams,
    queryParams: getUserCollectionsByUsernameQueryParams,
  },
  async ({ pathParams, queryParams }) => {
    const resp = await v0_client.GET("/v0/users/{username}/collections", {
      params: { path: pathParams, query: queryParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-user-collection",
  "获取用户单个条目收藏",
  {
    pathParams: getUserCollectionParams,
  },
  async ({ pathParams }) => {
    const resp = await v0_client.GET(
      "/v0/users/{username}/collections/{subject_id}",
      {
        params: { path: pathParams },
      }
    );
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "new-user-collection",
  "新增或修改用户单个条目收藏",
  {
    pathParams: postUserCollectionParams,
  },
  async ({ pathParams }) => {
    const resp = await v0_client.POST("/v0/users/-/collections/{subject_id}", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "patch-user-collection",
  "修改用户单个收藏",
  {
    pathParams: patchUserCollectionParams,
  },
  async ({ pathParams }) => {
    const resp = await v0_client.PATCH("/v0/users/-/collections/{subject_id}", {
      params: { path: pathParams },
    });
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-user-collection-episodes",
  "章节收藏信息",
  {
    pathParams: getUserSubjectEpisodeCollectionParams,
    queryParams: getUserSubjectEpisodeCollectionQueryParams,
  },
  async ({ pathParams, queryParams }) => {
    const resp = await v0_client.GET(
      "/v0/users/-/collections/{subject_id}/episodes",
      {
        params: { path: pathParams, query: queryParams },
      }
    );
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "patch-user-collection-episode",
  "修改用户单个收藏",
  {
    pathParams: patchUserSubjectEpisodeCollectionParams,
    bodyParams: patchUserSubjectEpisodeCollectionBody,
  },
  async ({ pathParams, bodyParams }) => {
    const resp = await v0_client.PATCH(
      "/v0/users/-/collections/{subject_id}/episodes",
      {
        params: { path: pathParams },
        body: bodyParams,
      }
    );
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-user-collection-episode",
  "章节收藏信息",
  {
    pathParams: getUserEpisodeCollectionParams,
  },
  async ({ pathParams }) => {
    const resp = await v0_client.GET(
      "/v0/users/-/collections/-/episodes/{episode_id}",
      {
        params: { path: pathParams },
      }
    );
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "put-user-collection-episode",
  "更新章节收藏信息",
  {
    pathParams: putUserEpisodeCollectionParams,
  },
  async ({ pathParams }) => {
    const resp = await v0_client.PUT(
      "/v0/users/-/collections/-/episodes/{episode_id}",
      {
        params: { path: pathParams },
      }
    );
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-user-collection-characters",
  "获取用户角色收藏列表",
  {
    pathParams: getUserCharacterCollectionsParams,
  },
  async ({ pathParams }) => {
    const resp = await v0_client.GET(
      "/v0/users/{username}/collections/-/characters",
      {
        params: { path: pathParams },
      }
    );
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-user-collection-character",
  "获取用户单个角色收藏信息",
  {
    pathParams: getUserCharacterCollectionParams,
  },
  async ({ pathParams }) => {
    const resp = await v0_client.GET(
      "/v0/users/{username}/collections/-/characters/{character_id}",
      {
        params: { path: pathParams },
      }
    );
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-user-collection-persons",
  "获取用户人物收藏列表",
  {
    pathParams: getUserPersonCollectionsParams,
  },
  async ({ pathParams }) => {
    const resp = await v0_client.GET(
      "/v0/users/{username}/collections/-/persons",
      {
        params: { path: pathParams },
      }
    );
    return fetchRespWarp(resp);
  }
);

mcpServer.tool(
  "get-user-collection-person",
  "获取用户单个人物收藏信息",
  {
    pathParams: getUserPersonCollectionParams,
  },
  async ({ pathParams }) => {
    const resp = await v0_client.GET(
      "/v0/users/{username}/collections/-/persons/{person_id}",
      {
        params: { path: pathParams },
      }
    );
    return fetchRespWarp(resp);
  }
);
