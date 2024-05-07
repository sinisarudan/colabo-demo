import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   *
   * @param context
   * @returns `true` if a user has one of the roles that are allowed for the specific context (route, controller, etc)
   */
  canActivate(context: ExecutionContext): boolean {
    // `reflector.get` retrieves metadata for a reflectable decorator for a specified target:
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const userRoles: string[] = this.getUserRoles(context);
    return this.matchRoles(roles, userRoles);
  }

  protected matchRoles(allowedRoles: string[], userRoles: string[]): boolean {
    if (!userRoles || !allowedRoles) return false;
    const matches: boolean = userRoles.some((role) =>
      allowedRoles.includes(role),
    );
    console.log(
      `[RolesGuard] ${matches ? 'ALLOWS' : "DOESN'T ALLOW"}, based on allowedRoles: ${allowedRoles} vs userRoles: ${userRoles}`,
    );
    return matches;
  }

  protected getUserRoles(context: ExecutionContext): string[] {
    const request: Request = context.switchToHttp().getRequest();
    // const user = request.user;
    /* the above ^^ would be correct approach to get user!
     * In the **node.js world**, it's **common practice** to *attach the authorized `user` to the `request` object*.
     * Thus, we would assume that `request.user` contains the user instance and allowed roles.
     * In our app, we would probably make that association in our **custom authentication guard** (or **middleware**).
     * Check the [**authentication** chapter](https://docs.nestjs.com/security/authentication) for more information.
     * but So far, we mock getting (logged-in) user up by getting roles of user that is to be created, 
     * i.e passed as an argument to the controller, so available in the `context`
     * */
    // Assuming the payload is sent in the body of a POST request
    const payload = request.body;
    const user = payload;
    const roles: string[] = user.roles;
    console.log("user's roles:", roles);
    return roles;
  }
}
