import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { linkupApiRequest } from './GenericFunctions';


export class Linkup implements INodeType {
	description: INodeTypeDescription = {
			displayName: 'Linkup',
			name: 'linkup',
			icon: 'file:linkup.svg',
			group: ['output'],
			version: 1,
			description: 'Search and retrieve insights using the Linkup API',
			defaults: {
				name: 'Linkup',
			},
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',

			inputs: [NodeConnectionType.Main],
			outputs: [NodeConnectionType.Main],
			credentials: [
				{
					name: 'linkupApi',
					required: true,
				},
			],
			properties: [
				{
					displayName: 'Resource',
					name: 'resource',
					type: 'options',
					noDataExpression: true,
					options: [
						{
							name: 'Search',
							value: 'search',
						},
						{
							name: 'Sourced',
							value: 'sourced',
						},
					],
					default: 'search',
				},
				{
					displayName: 'Query',
					name: 'query',
					type: 'string',
					default: '',
					required: true,
				},
				{
					displayName: 'Search Depth',
					name: 'depth',
					type: 'options',
					options: [
						{ name: 'Standard', value: 'standard' },
						{ name: 'Deep', value: 'deep' },
					],
					default: 'standard',
					displayOptions: {
							show: {
								resource: ['search', 'sourced'],
							},
					},
				},
			],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		for (let i = 0; i < items.length; i++) {
			const query = this.getNodeParameter('query', i) as string;
			const depth = this.getNodeParameter('depth', i) as string;
			const resource = this.getNodeParameter('resource', i) as string;
			const outputType = resource === 'search' ? 'searchResults' : 'sourcedAnswer';

			const responseData = await linkupApiRequest.call(
				this,
				query,
				depth,
				outputType,
			);
			if (Array.isArray(responseData)) {
				returnData.push.apply(returnData, responseData as IDataObject[]);
			} else {
				returnData.push(responseData as IDataObject);
			}
		}

			return [this.helpers.returnJsonArray(returnData)];
	}
}
