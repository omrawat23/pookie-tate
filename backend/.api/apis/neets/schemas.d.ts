declare const CreateChatCompletion: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly messages: {
                readonly description: "A list of messages comprising the conversation so far.";
                readonly type: "array";
                readonly minItems: 1;
                readonly items: {
                    readonly oneOf: readonly [{
                        readonly type: "object";
                        readonly title: "User message";
                        readonly properties: {
                            readonly content: {
                                readonly nullable: true;
                                readonly description: "The contents of the user message.\n";
                                readonly oneOf: readonly [{
                                    readonly type: "string";
                                    readonly description: "The text contents of the message.";
                                    readonly title: "Text content";
                                }, {
                                    readonly type: "array";
                                    readonly description: "An array of content parts with a defined type, each can be of type `text` or `image_url` when passing in images. You can pass multiple images by adding multiple `image_url` content parts. Image input is only supported when using the `gpt-4-visual-preview` model.";
                                    readonly title: "Array of content parts";
                                    readonly items: {
                                        readonly oneOf: readonly [{
                                            readonly type: "object";
                                            readonly title: "Text content part";
                                            readonly properties: {
                                                readonly type: {
                                                    readonly type: "string";
                                                    readonly enum: readonly ["text"];
                                                    readonly description: "The type of the content part.";
                                                };
                                                readonly text: {
                                                    readonly type: "string";
                                                    readonly description: "The text content.";
                                                };
                                            };
                                            readonly required: readonly ["type", "text"];
                                        }, {
                                            readonly type: "object";
                                            readonly title: "Image content part";
                                            readonly properties: {
                                                readonly type: {
                                                    readonly type: "string";
                                                    readonly enum: readonly ["image_url"];
                                                    readonly description: "The type of the content part.";
                                                };
                                                readonly image_url: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly url: {
                                                            readonly type: "string";
                                                            readonly description: "Either a URL of the image or the base64 encoded image data.";
                                                            readonly format: "uri";
                                                        };
                                                        readonly detail: {
                                                            readonly type: "string";
                                                            readonly description: "Specifies the detail level of the image.\n\nDefault: `auto`";
                                                            readonly enum: readonly ["auto", "low", "high"];
                                                            readonly default: "auto";
                                                        };
                                                    };
                                                    readonly required: readonly ["url"];
                                                };
                                            };
                                            readonly required: readonly ["type", "image_url"];
                                        }];
                                        readonly "x-oaiExpandable": true;
                                    };
                                    readonly minItems: 1;
                                }];
                            };
                            readonly role: {
                                readonly type: "string";
                                readonly enum: readonly ["user"];
                                readonly description: "The role of the messages author, in this case `user`.";
                            };
                        };
                        readonly required: readonly ["content", "role"];
                    }, {
                        readonly type: "object";
                        readonly title: "Assistant message";
                        readonly properties: {
                            readonly content: {
                                readonly type: readonly ["string", "null"];
                                readonly description: "The contents of the assistant message.\n";
                            };
                            readonly role: {
                                readonly type: "string";
                                readonly enum: readonly ["assistant"];
                                readonly description: "The role of the messages author, in this case `assistant`.";
                            };
                        };
                        readonly required: readonly ["content", "role"];
                    }];
                    readonly "x-oaiExpandable": true;
                };
            };
            readonly model: {
                readonly description: "ID of the model to use. `mistralai/Mixtral-8X7B-Instruct-v0.1`";
                readonly anyOf: readonly [{
                    readonly type: "string";
                }, {
                    readonly type: "string";
                    readonly enum: readonly ["gpt-4-1106-preview", "gpt-4-vision-preview", "gpt-4", "gpt-4-0314", "gpt-4-0613", "gpt-4-32k", "gpt-4-32k-0314", "gpt-4-32k-0613", "gpt-3.5-turbo-1106", "gpt-3.5-turbo", "gpt-3.5-turbo-16k", "gpt-3.5-turbo-0301", "gpt-3.5-turbo-0613", "gpt-3.5-turbo-16k-0613"];
                }];
                readonly "x-oaiTypeLabel": "string";
                readonly examples: readonly ["mistralai/Mixtral-8X7B-Instruct-v0.1"];
            };
            readonly frequency_penalty: {
                readonly type: readonly ["number", "null"];
                readonly default: 0;
                readonly minimum: -2;
                readonly maximum: 2;
                readonly description: "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.\n";
            };
            readonly max_tokens: {
                readonly description: "The maximum number of [tokens](/tokenizer) to generate in the chat completion.\n\nThe total length of input tokens and generated tokens is limited by the model's context length.\n";
                readonly default: "inf";
                readonly type: readonly ["integer", "null"];
            };
            readonly n: {
                readonly type: readonly ["integer", "null"];
                readonly minimum: 1;
                readonly maximum: 128;
                readonly default: 1;
                readonly description: "How many chat completion choices to generate for each input message.";
                readonly examples: readonly [1];
            };
            readonly presence_penalty: {
                readonly type: readonly ["number", "null"];
                readonly default: 0;
                readonly minimum: -2;
                readonly maximum: 2;
                readonly description: "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.\n";
            };
            readonly response_format: {
                readonly type: "object";
                readonly description: "An object specifying the format that the model must output.\n\nSetting to `{ \"type\": \"json_object\" }` enables JSON mode, which guarantees the message the model generates is valid JSON.\n\n**Important:** when using JSON mode, you **must** also instruct the model to produce JSON yourself via a system or user message. Without this, the model may generate an unending stream of whitespace until the generation reaches the token limit, resulting in increased latency and appearance of a \"stuck\" request. Also note that the message content may be partially cut off if `finish_reason=\"length\"`, which indicates the generation exceeded `max_tokens` or the conversation exceeded the max context length.\n";
                readonly properties: {
                    readonly type: {
                        readonly type: "string";
                        readonly enum: readonly ["text", "json_object"];
                        readonly default: "text";
                        readonly description: "Must be one of `text` or `json_object`.\n\nDefault: `text`";
                        readonly examples: readonly ["json_object"];
                    };
                };
            };
            readonly seed: {
                readonly type: readonly ["integer", "null"];
                readonly minimum: -9223372036854776000;
                readonly maximum: 9223372036854776000;
                readonly description: "This feature is in Beta.\nIf specified, our system will make a best effort to sample deterministically, such that repeated requests with the same `seed` and parameters should return the same result.\nDeterminism is not guaranteed, and you should refer to the `system_fingerprint` response parameter to monitor changes in the backend.\n";
                readonly "x-oaiMeta": {
                    readonly beta: true;
                };
            };
            readonly stop: {
                readonly description: "Up to 4 sequences where the API will stop generating further tokens.\n";
                readonly default: any;
                readonly oneOf: readonly [{
                    readonly type: readonly ["string", "null"];
                }, {
                    readonly type: "array";
                    readonly minItems: 1;
                    readonly maxItems: 4;
                    readonly items: {
                        readonly type: "string";
                    };
                }];
            };
            readonly stream: {
                readonly description: "If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message.\n";
                readonly type: readonly ["boolean", "null"];
                readonly default: false;
            };
            readonly temperature: {
                readonly type: readonly ["number", "null"];
                readonly minimum: 0;
                readonly maximum: 2;
                readonly default: 1;
                readonly description: "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.\n\nWe generally recommend altering this or `top_p` but not both.\n";
                readonly examples: readonly [1];
            };
            readonly top_p: {
                readonly type: readonly ["number", "null"];
                readonly minimum: 0;
                readonly maximum: 1;
                readonly default: 1;
                readonly description: "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.\n\nWe generally recommend altering this or `temperature` but not both.\n";
                readonly examples: readonly [1];
            };
        };
        readonly required: readonly ["model", "messages"];
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly description: "Represents a chat completion response returned by model, based on the provided input.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "A unique identifier for the chat completion.";
                };
                readonly choices: {
                    readonly type: "array";
                    readonly description: "A list of chat completion choices. Can be more than one if `n` is greater than 1.";
                    readonly items: {
                        readonly type: "object";
                        readonly required: readonly ["finish_reason", "index", "message"];
                        readonly properties: {
                            readonly finish_reason: {
                                readonly type: "string";
                                readonly description: "The reason the model stopped generating tokens. This will be `stop` if the model hit a natural stop point or a provided stop sequence,\n`length` if the maximum number of tokens specified in the request was reached,\n`content_filter` if content was omitted due to a flag from our content filters,\n`tool_calls` if the model called a tool, or `function_call` (deprecated) if the model called a function.\n\n\n`stop` `length` `tool_calls` `content_filter` `function_call`";
                                readonly enum: readonly ["stop", "length", "tool_calls", "content_filter", "function_call"];
                            };
                            readonly index: {
                                readonly type: "integer";
                                readonly description: "The index of the choice in the list of choices.";
                            };
                            readonly message: {
                                readonly type: "object";
                                readonly description: "A chat completion message generated by the model.";
                                readonly properties: {
                                    readonly content: {
                                        readonly type: readonly ["string", "null"];
                                        readonly description: "The contents of the message.";
                                    };
                                    readonly tool_calls: {
                                        readonly type: "array";
                                        readonly description: "The tool calls generated by the model, such as function calls.";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly id: {
                                                    readonly type: "string";
                                                    readonly description: "The ID of the tool call.";
                                                };
                                                readonly type: {
                                                    readonly type: "string";
                                                    readonly enum: readonly ["function"];
                                                    readonly description: "The type of the tool. Currently, only `function` is supported.\n\n`function`";
                                                };
                                                readonly function: {
                                                    readonly type: "object";
                                                    readonly description: "The function that the model called.";
                                                    readonly properties: {
                                                        readonly name: {
                                                            readonly type: "string";
                                                            readonly description: "The name of the function to call.";
                                                        };
                                                        readonly arguments: {
                                                            readonly type: "string";
                                                            readonly description: "The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function.";
                                                        };
                                                    };
                                                    readonly required: readonly ["name", "arguments"];
                                                };
                                            };
                                            readonly required: readonly ["id", "type", "function"];
                                        };
                                    };
                                    readonly role: {
                                        readonly type: "string";
                                        readonly enum: readonly ["assistant"];
                                        readonly description: "The role of the author of this message.\n\n`assistant`";
                                    };
                                    readonly function_call: {
                                        readonly type: "object";
                                        readonly deprecated: true;
                                        readonly description: "Deprecated and replaced by `tool_calls`. The name and arguments of a function that should be called, as generated by the model.";
                                        readonly properties: {
                                            readonly arguments: {
                                                readonly type: "string";
                                                readonly description: "The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function.";
                                            };
                                            readonly name: {
                                                readonly type: "string";
                                                readonly description: "The name of the function to call.";
                                            };
                                        };
                                        readonly required: readonly ["name", "arguments"];
                                    };
                                };
                                readonly required: readonly ["role", "content"];
                            };
                        };
                    };
                };
                readonly created: {
                    readonly type: "integer";
                    readonly description: "The Unix timestamp (in seconds) of when the chat completion was created.";
                };
                readonly model: {
                    readonly type: "string";
                    readonly description: "The model used for the chat completion.";
                };
                readonly system_fingerprint: {
                    readonly type: "string";
                    readonly description: "This fingerprint represents the backend configuration that the model runs with.\n\nCan be used in conjunction with the `seed` request parameter to understand when backend changes have been made that might impact determinism.\n";
                };
                readonly object: {
                    readonly type: "string";
                    readonly description: "The object type, which is always `chat.completion`.\n\n`chat.completion`";
                    readonly enum: readonly ["chat.completion"];
                };
                readonly usage: {
                    readonly type: "object";
                    readonly description: "Usage statistics for the completion request.";
                    readonly properties: {
                        readonly completion_tokens: {
                            readonly type: "integer";
                            readonly description: "Number of tokens in the generated completion.";
                        };
                        readonly prompt_tokens: {
                            readonly type: "integer";
                            readonly description: "Number of tokens in the prompt.";
                        };
                        readonly total_tokens: {
                            readonly type: "integer";
                            readonly description: "Total number of tokens used in the request (prompt + completion).";
                        };
                    };
                    readonly required: readonly ["prompt_tokens", "completion_tokens", "total_tokens"];
                };
            };
            readonly required: readonly ["choices", "created", "id", "model", "object"];
            readonly "x-oaiMeta": {
                readonly name: "The chat completion object";
                readonly group: "chat";
                readonly example: "{\n  \"id\": \"chatcmpl-123\",\n  \"object\": \"chat.completion\",\n  \"created\": 1677652288,\n  \"model\": \"gpt-3.5-turbo-0613\",\n  \"system_fingerprint\": \"fp_44709d6fcb\",\n  \"choices\": [{\n    \"index\": 0,\n    \"message\": {\n      \"role\": \"assistant\",\n      \"content\": \"\\n\\nHello there, how may I assist you today?\",\n    },\n    \"finish_reason\": \"stop\"\n  }],\n  \"usage\": {\n    \"prompt_tokens\": 9,\n    \"completion_tokens\": 12,\n    \"total_tokens\": 21\n  }\n}\n";
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetVoices: {
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly voices: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "ID of the voice";
                            };
                            readonly alias_of: {
                                readonly type: readonly ["string", "null"];
                                readonly description: "ID of the Voice that this voice_id is an alias of";
                            };
                            readonly title: {
                                readonly type: readonly ["string", "null"];
                                readonly description: "Name of the voice";
                            };
                            readonly supported_models: {
                                readonly type: "array";
                                readonly description: "A list of models that the voice can be used with.";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PostTts: {
    readonly body: {
        readonly properties: {
            readonly text: {
                readonly title: "Text";
                readonly description: "Text to convert to speech";
                readonly type: "string";
            };
            readonly voice_id: {
                readonly title: "Voice ID";
                readonly description: "ID of the voice to use. Voice IDs are dependent on the TTS model used. See the **Voice IDs** section on any [TTS model](/reference/models) for a list of available voices.";
                readonly type: "string";
            };
            readonly fmt: {
                readonly title: "Format";
                readonly description: "Output audio format. See [Audio Formats](/reference/supported-audio-formats) for a list of all supported output formats.\n\nDefault: `mp3`";
                readonly default: "mp3";
                readonly type: "string";
                readonly enum: readonly ["aac", "flac", "mp3", "mulaw", "ogg", "opus", "wav"];
            };
            readonly params: {
                readonly title: "Parameters";
                readonly description: "Model-specific parameters. TTS model parameters must be selected to make a valid request. See the [Models page](/reference/models) for a complete list of TTS models that you can use.\n";
                readonly oneOf: readonly [{
                    readonly properties: {
                        readonly model: {
                            readonly const: "style-diff-500";
                            readonly title: "Model";
                            readonly default: "style-diff-500";
                        };
                        readonly alpha: {
                            readonly type: "number";
                            readonly maximum: 1;
                            readonly minimum: 0;
                            readonly title: "Alpha";
                            readonly description: "Only used for long text inputs or in case of reference speaker, determines the timbre of the speaker. Use lower values to sample style based on previous or reference speech instead of text.";
                            readonly default: 0.3;
                        };
                        readonly beta: {
                            readonly type: "number";
                            readonly maximum: 1;
                            readonly minimum: 0;
                            readonly title: "Beta";
                            readonly description: "Only used for long text inputs or in case of reference speaker, determines the prosody of the speaker. Use lower values to sample style based on previous or reference speech instead of text.";
                            readonly default: 0.7;
                        };
                        readonly diffusion_steps: {
                            readonly type: "integer";
                            readonly maximum: 20;
                            readonly minimum: 5;
                            readonly title: "Diffusion Steps";
                            readonly description: "Number of diffusion steps";
                            readonly default: 10;
                        };
                        readonly embedding_scale: {
                            readonly type: "number";
                            readonly maximum: 10;
                            readonly minimum: 0;
                            readonly title: "Embedding Scale";
                            readonly description: "Embedding scale, use higher values for pronounced emotion";
                            readonly default: 1;
                        };
                    };
                    readonly type: "object";
                    readonly title: "style-diff-500 Params";
                    readonly description: "Parameters for the [style-diff-500](/reference/style-diff-500) TTS model";
                }, {
                    readonly properties: {
                        readonly model: {
                            readonly const: "vits";
                            readonly title: "Model";
                            readonly default: "vits";
                        };
                        readonly speed: {
                            readonly type: "number";
                            readonly maximum: 10;
                            readonly minimum: 0.1;
                            readonly title: "Speed";
                            readonly description: "Adjusts the speed of speaker audio.";
                            readonly default: 1;
                        };
                    };
                    readonly type: "object";
                    readonly title: "VITS Params";
                    readonly description: "Parameters for the [VITS](/reference/vits) TTS model";
                }, {
                    readonly properties: {
                        readonly model: {
                            readonly const: "ar-diff-50k";
                            readonly title: "Model";
                            readonly default: "ar-diff-50k";
                        };
                        readonly temperature: {
                            readonly type: "number";
                            readonly maximum: 3;
                            readonly minimum: 0.01;
                            readonly title: "Temperature";
                            readonly default: 0.5;
                        };
                        readonly diffusion_iterations: {
                            readonly type: "integer";
                            readonly maximum: 300;
                            readonly minimum: 5;
                            readonly title: "Diffusion Iterations";
                            readonly default: 30;
                        };
                    };
                    readonly type: "object";
                    readonly title: "ar-diff-50k Params";
                    readonly description: "Parameters for the [ar-diff-50k](/reference/ar-diff-50k) TTS model";
                }];
                readonly discriminator: {
                    readonly propertyName: "model";
                    readonly mapping: {
                        readonly "ar-diff-50k": "#/components/schemas/ArDiff50kParams";
                        readonly vits: "#/components/schemas/VITSParams";
                        readonly "style-diff-500": "#/components/schemas/StyleDiff500Params";
                    };
                };
            };
        };
        readonly type: "object";
        readonly required: readonly ["text", "voice_id", "params"];
        readonly title: "TTSParams";
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PostVoices: {
    readonly body: {
        readonly properties: {
            readonly files: {
                readonly title: "Text";
                readonly description: "The complete file path of the audio to create the voice clone from. The path must be followed by a semicolon with the content type, for example; type=audio/wav. Multiple files can be sent by including this argument multiple times.";
                readonly type: "multipart/form-data";
            };
        };
        readonly type: "object";
        readonly required: readonly ["files"];
        readonly title: "VoiceJobParams";
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "201": {
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
export { CreateChatCompletion, GetVoices, PostTts, PostVoices };
