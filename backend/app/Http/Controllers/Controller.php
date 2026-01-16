<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
  title: "HRM Platform API",
  version: "1.0.0",
  description: "API documentation for HRM Platform"
)]
#[OA\Server(
  url: "http://localhost:8000",
  description: "Local Server"
)]
#[OA\SecurityScheme(
  securityScheme: "sanctum",
  type: "apiKey",
  name: "Authorization",
  in: "header",
  description: "Enter token in format (Bearer <token>)"
)]
#[OA\Get(
  path: "/api/v1/test",
  summary: "Check if API is working",
  tags: ["System"],
  responses: [
    new OA\Response(
      response: 200,
      description: "Success",
      content: new OA\JsonContent(
        properties: [
          new OA\Property(property: "message", type: "string", example: "API is working!")
        ]
      )
    )
  ]
)]
class Controller extends \Illuminate\Routing\Controller
{
  use \Illuminate\Foundation\Auth\Access\AuthorizesRequests,
    \Illuminate\Foundation\Validation\ValidatesRequests;
}
