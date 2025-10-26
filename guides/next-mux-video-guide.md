To create a front-end video player in your Next.js 15 app that supports signed playback for videos uploaded via the Sanity CMS with the Mux plugin, follow these steps:

---

### **Instructions for Front-End Video Player Setup**

1. **Install Required Dependencies**
   Ensure you have the necessary Mux packages installed in your Next.js project. Run the following command in your Next.js project directory:

   ```bash
   npm install @mux/mux-player-react
   ```

2. **Retrieve Signed Playback ID and Token**
   - In your Sanity Studio, enable signed playback in the Mux plugin configuration. This ensures that assets uploaded to Mux through Sanity are created with `playback_policy: "signed"`.
   - Use the `MuxAsset.data.playback_ids` property to retrieve the `signed` playback ID for the asset.
   - Generate a signing token on your **server** using the signing key created in the Sanity configuration. This token will be appended to the playback URL for secure video access.

3. **Create a Video Playback Component**
   Use the `MuxPlayer` React component to play the video. Pass the signed playback ID and token to the `playbackId` and `token` props, respectively.

   Example code for the playback page:

   ```jsx
   import MuxPlayer from "@mux/mux-player-react";

   export default function VideoPlayer({ playbackId, token }) {
     return (
       <mux-player
         playbackId={playbackId}
         streamType="on-demand"
         token={token}
         metadata={{
           video_title: "Your Video Title",
           viewer_user_id: "user-id-123",
         }}
         style={{ width: "100%", height: "auto" }}
       />
     );
   }
   ```

4. **Generate Signed Token on the Server**
   Signed tokens must be generated on your server using the signing key created in the Sanity configuration. Use the Mux Node SDK to generate the token.

   Example server-side code:

   ```javascript
   import Mux from "@mux/mux-node";

   const mux = new Mux();
   const signingKeyId = process.env.MUX_SIGNING_KEY_ID;
   const signingKeySecret = process.env.MUX_SIGNING_KEY_SECRET;

   export function generateSignedToken(playbackId) {
     const token = mux.jwt.sign(playbackId, signingKeyId, signingKeySecret, {
       expiration: "1h", // Token expires in 1 hour
     });
     return token;
   }
   ```

5. **Fetch Video Metadata**
   Create an API route in your Next.js app to fetch the playback ID and generate the signed token.

   Example API route:

   ```javascript
   import { generateSignedToken } from "@/lib/mux";

   export default async function handler(req, res) {
     const { playbackId } = req.query;

     if (!playbackId) {
       return res.status(400).json({ error: "Playback ID is required" });
     }

     const token = generateSignedToken(playbackId);
     res.status(200).json({ playbackId, token });
   }
   ```

6. **Integrate API with Front-End**
   Fetch the playback ID and token from the API route and pass them to the `VideoPlayer` component.

   Example Next.js page:

   ```javascript
   import { useEffect, useState } from "react";
   import VideoPlayer from "@/components/VideoPlayer";

   export default function PlaybackPage({ playbackId }) {
     const [token, setToken] = useState(null);

     useEffect(() => {
       async function fetchToken() {
         const response = await fetch(
           `/api/get-token?playbackId=${playbackId}`,
         );
         const data = await response.json();
         setToken(data.token);
       }

       fetchToken();
     }, [playbackId]);

     if (!token) {
       return <p>Loading...</p>;
     }

     return <VideoPlayer playbackId={playbackId} token={token} />;
   }
   ```

7. **Test Your Setup**
   - Ensure your Sanity Studio is correctly configured to generate signed playback IDs.
   - Verify that your server generates valid tokens using the signing key.
   - Test the playback page by passing a valid signed playback ID from your Sanity CMS.

---

For more details on signed playback and token generation, refer to the [Signed Tokens](https://mux.com/docs/integrations/sanity) section of the Mux documentation.
