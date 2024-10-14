import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';
export type CreateChatCompletionBodyParam = FromSchema<typeof schemas.CreateChatCompletion.body>;
export type CreateChatCompletionResponse200 = FromSchema<typeof schemas.CreateChatCompletion.response['200']>;
export type GetVoicesResponse200 = FromSchema<typeof schemas.GetVoices.response['200']>;
export type PostTtsBodyParam = FromSchema<typeof schemas.PostTts.body>;
export type PostTtsResponse200 = FromSchema<typeof schemas.PostTts.response['200']>;
export type PostVoicesBodyParam = FromSchema<typeof schemas.PostVoices.body>;
export type PostVoicesResponse201 = FromSchema<typeof schemas.PostVoices.response['201']>;
