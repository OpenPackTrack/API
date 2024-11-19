# Pack Track API

This is a RESTful API to track packages across different carriers. It is built using Encore, a full-stack TypeScript framework.

## Prerequisites 

**Install Encore:**
- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

## Run app locally

Run this command from your application's root folder:

```bash
encore run
```
## Using the API

To see that your app is running, you can ping the API.

```bash
curl http://localhost:4000/track/RC401000000CN/4PX
```