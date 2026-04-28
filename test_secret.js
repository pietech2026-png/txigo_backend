import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dmqgc5prf",
  api_key: "228259444255745",
  api_secret: "hRIjyR1JJpwxKfSjfX6Rgww2-z8"
});

try {
  // Let's print out what ping does or try an explicit Admin API call, which requires valid secret.
  const result = await cloudinary.api.ping();
  console.log("SUCCESS PING:", result);
} catch (e) {
  console.log("FAILURE:", e);
}
