// declare module 'passport-google-oidc' {
// 	import { Strategy as PassportStrategy } from 'passport-strategy';
// 	import type { Request } from 'express';

//   interface StrategyOptions {
//     clientID: string;
//     clientSecret: string;
//     callbackURL: string;
//     scope?: string | string[];
//     passReqToCallback?: boolean;
//     prompt?: string;
//   }

//   interface Profile {
//     id: string;
// 		name?: {
// 			givenName: string;
// 			familyName: string;
// 		};
// 		emails?: {
// 			value: string
// 			type: string
// 		}[];
//     displayName: string;
//     provider?: string;
//     _raw?: string;
//     _json?: object;
//   }

//   type VerifyFunction = (
// 		req?: Request,
//     issuer: string,
//     profile: Profile,
//     done: (error: any, user?: any, info?: any) => void
//   ) => void;

//   export class Strategy extends PassportStrategy {
//     constructor(options: StrategyOptions, verify: VerifyFunction);
//   }

//   // export = Strategy;
// }