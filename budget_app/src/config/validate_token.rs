use tower::{Service, ServiceExt};
use http::Request;
use std::task::{Context, Poll};
use tower::util::ServiceExt;
use tower_http::auth::RequireAuthorizationLayer;
use tower_http::auth::Authorization;
use http::header::AUTHORIZATION;

struct ValidateToken<S> {
    inner: S,
}

impl<S, ReqBody> Service<Request<ReqBody>> for ValidateToken<S> 
where
    S: Service<Request<ReqBody>>,
{
    type Response = S::Response;
    type Error = S::Error;
    type Future = S::Future;

    fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.inner.poll_ready(cx)
    }

    fn call(&mut self, mut req: Request<ReqBody>) -> Self::Future {
        if let Some(header) = req.headers().get(AUTHORIZATION) {
            let auth = Authorization::from_header(header.as_bytes()).unwrap();
            if validate_token(auth.token()) {
                self.inner.call(req)
            } else {
                // return error response
            }
        } else {
            // return error response
        }
    }
}

