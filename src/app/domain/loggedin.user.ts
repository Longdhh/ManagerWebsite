export class LoggedInUser {
    constructor(access_token: string, username: string, name: any, email: string, avatar: string, roles: any) {
        this.access_token = access_token;
        this.username = username;
        this.name = name;
        this.email = email;
        this.avatar = avatar;
        this.roles = roles;
    }
    public id: string;
    public access_token: string;
    public username: string;
    public name: string;
    public email: string;
    public avatar: string;
    public roles: any;
}