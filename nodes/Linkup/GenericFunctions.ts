import { LinkupClient } from 'linkup-sdk';
import type { IExecuteFunctions, JsonObject, ILoadOptionsFunctions, IHookFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function linkupApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	query: string,
	depth: string,
	outputType: string,
): Promise<any> {
	try {
		const credentials = await this.getCredentials('linkupApi');
		const apiKey = credentials.apiKey as string;

		const client = new LinkupClient({ apiKey });
		const params: Record<string, string> = {
			query,
			depth,
			outputType,
		};


		const response = await client.search(params as any);

		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
