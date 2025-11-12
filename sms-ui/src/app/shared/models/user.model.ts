import {Deserializable} from './deserializable.model';
import { Common } from './common.model';
export class User extends Common implements Deserializable {
    username: string = "";
    password: string = "";
    firstName: string = "";
    lastName: string = "";
    accessToken: string = "";
    tokenType: string = "";
    refreshToken: string = "";
    scope: string = "";
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
    getFullName() {
        return this.firstName + ' ' + this.lastName;
    }
}
