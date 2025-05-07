import type {
	ICredentialType,
	ICredentialDataDecryptedObject,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';
import { ApplicationError } from 'n8n-workflow';

interface LoginResponse {
	status: string;
	api_token?: string;
}

export class LEDGERSApi implements ICredentialType {
	name = 'ledgersApi';

	displayName = 'LEDGERS API';

	documentationUrl = '';

	httpRequest!: (options: IHttpRequestOptions) => Promise<any>;

	properties: INodeProperties[] = [
		{
			displayName: 'X-API-Key',
			name: 'xApiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		if (!this.httpRequest) {
			throw new ApplicationError('HTTP request helper not available', { level: 'warning' });
		}

		const loginRequest: IHttpRequestOptions = {
			method: 'POST',
			url: 'https://in-api-dev.ledgers.cloud/v3/login',
			body: {
				email: credentials.email,
				password: credentials.password,
			},
			json: true,
		};

		const response = (await this.httpRequest(loginRequest)) as LoginResponse;

		if (response.status !== 'success' || !response.api_token) {
			throw new ApplicationError('Authentication failed. Check your credentials.', {
				level: 'warning',
			});
		}

		requestOptions.headers = {
			...requestOptions.headers,
			'Content-Type': 'application/json',
			'x-api-key': credentials.xApiKey as string,
			'api-token': response.api_token,
		};

		return requestOptions;
	}
}
