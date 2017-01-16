# bloggernation
Microservices Blogging Network

This is the index repo for various other working components:  
  * [BN-WebClient](https://github.com/rocketspacer/BN-WebClient) - Frontend Web Application, using Bootstrap & AngularJs, served over S3 & CloudFlare  
  * [BN-Gateway](https://github.com/rocketspacer/BN-WebGateway) - API Gateway, entry-point for Microservices System, running behind NGINX on EC2. Proxying request to internal services and pre-authenticated them if needed.
  * [BN-Auth](https://github.com/rocketspacer/BN-Auth) - Authentication Service, accepts authentication via other OAuth Providers (Facebook, Google, ...), issue JWT for token-based authentication strategy.
  * [BN-Profile](https://github.com/rocketspacer/BN-Profile) - Store and serve blogger profile information, a bussiness-logic component
