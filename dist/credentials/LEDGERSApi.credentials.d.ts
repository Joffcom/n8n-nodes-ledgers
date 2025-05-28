import type { ICredentialType, INodeProperties, ICredentialTestRequest, IAuthenticateGeneric, Icon } from 'n8n-workflow';
export declare class LEDGERSApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: Icon;
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
