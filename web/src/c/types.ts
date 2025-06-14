export type User = {
    id: number;
    username?: string;
    given_name: string;
    family_name: string;
    picture?: string;
    role: string;
}

export type Category = {
    id: number;
    name: string;
    description: string;
    slug: string;
    href: string;
    path: string;
    sort: number;
    price?: boolean;
    children?: Category[];
}

export type Prop = {
    id: number;
    name: string;
    title: string;
    group: string;
    required: boolean;
    template: string;
    description: string;
    help: string;
    type: string;
    sort: number;
    options: any;
    microdata: any;
    inherited: boolean;
}

export type County = {
    id: number;
    name: string;
}

export type City = {
    id: number;
    county: number;
    name: string;
    county_name: string;
}

export type Location = {
    href: string;
    text: string;
    refs: number[];
}

export type Ad = {
    id: number,
    category: Category,
    slug: string,
    owner: User,
    title: string,
    description: string,
    pictures: string[],
    url: string;
    href: string;
    price: number;
    currency: 'Lei',
    location: Location;
    messages: boolean,
    show_phone: boolean;
    status: 'published',
    published: string;
    valid_through: string;
    created: string
    props:{[key:string]:any}
    promotion: boolean;
    favourite: boolean;
}

export type TokenResponse = {
    token: string;
}

export type CreateUserRequest = {
    given_name: string;
    family_name: string;
    city: number;
    phone: string;
    referrer?: string;
}

export type CreateUserResponse = {
    id: number;
    given_name: string;
}

export type Chat = {
    id: number;
    title: string;
    context: string;
    reference: string;
    participants: User[];
    archived: number[];
    created_at: string;
}

export type Message = {
    id: number;
    from: User;
    message: string;
    seen: {[key: number]: string};
    created_at: string;
}

export type SeoEntry = {
    id: number;
    uri: string;
    title: string;
    description: string;
    keywords: string;
    image: string;
}

export type AdMetrics = {
    views: number;
    messages: number;
    favourites: number;
    week: number[];
}

export type ReportData = {
    name: string
    email: string
    reason: string
    message: string
    resource: string;
    reference: number;
}

export type AdCounts = {
    drafts: number;
    pending: number;
    rejected: number;
    fixing: number;
    published: number;
    completed: number;
    favourite: number;
}

export type AuthInfo = {
    token: string;
    // in days
    expire: number;
}

export type Notification = {
    id: number;
    owner: number;
    variant: 'info' | 'alert' | 'warning' | 'error' | 'fatal' | 'system' | 'promotion',
    title: string;
    contents: string;
    href: string;
    actions:{[key:string]:string};
    seen: Date | string;
    created: Date | string;
}

export type UserApp = {
    id: number;
    owner_id: number;
    owner: any;
    name: string;
    key: string;
    enabled: boolean;
    created: Date | string;
}

export type D = { [key: string]: any };