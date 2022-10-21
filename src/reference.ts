export interface ReferenceOptions {
    digest?: string;
    type?: ReferenceType;
    domain?: string;
    repository?: string;
    tag?: string;
}

const typesTemplates = {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    'digest': (ref: Reference) => `${ref.digest}`,
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    'canonical': (ref: Reference) => `${ref.repositoryUrl}@${ref.digest}`,
    'repository': (ref: Reference) => `${ref.repositoryUrl}`,
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    'tagged': (ref: Reference) => `${ref.repositoryUrl}:${ref.tag}`,
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    'dual': (ref: Reference) => `${ref.repositoryUrl}:${ref.tag}@${ref.digest}`
};

export type ReferenceType = keyof typeof typesTemplates

export class Reference {
    get tag(): string | undefined{
        return this._tag;
    }
    get digest(): string | undefined{
        return this._digest;
    }
    get repository(): string | undefined{
        return this._repository;
    }
    get domain(): string | undefined{
        return this._domain;
    }
    get type(): ReferenceType{
        return this._type
    }
    private readonly _domain: string | undefined ;
    private readonly _repository: string | undefined ;
    private readonly _digest: string | undefined ;
    private readonly _type: ReferenceType;
    private readonly _tag: string | undefined ;

    constructor(options: ReferenceOptions) {
        if (!options.repository && !options.domain) {
            if (options.digest) {
                this._digest = options.digest;
                this._type = 'digest';
            } else {
                throw new TypeError('Empty Reference');
            }
        } else if (!options.tag) {
            this._domain = options.domain ?? '';
            this._repository = options.repository ?? '';
            if (options.digest) {
                this._digest = options.digest;
                this._type = 'canonical';
            } else {
                this._type = 'repository';
            }
        } else if (!options.digest) {
            this._domain= options.domain ?? '';
            this._repository = options.repository ?? '';
            this._tag = options.tag;
            this._type= 'tagged';
        } else {
            this._domain = options.domain ?? '';
            this._repository = options.repository ?? '';
            this._tag = options.tag;
            this._digest = options.digest;
            this._type = 'dual';
        }
    }

    toString() {
        return typesTemplates[this._type](this);
    }

    get repositoryUrl() {
        if(this._domain && this._repository) {
            return `${this._domain}/${this._repository}`;
        }
        return ''
    }
}
