# Profile and blog

- `/`: the profile page, maintained in `profile/index.html`, `profile/profile.css`, and `profile/profile.js`.
- `/blog/`: the existing Hexo/NexT blog. Sources and theme remain unchanged; `_config.blog.yml` supplies its subdirectory configuration.
- `/iris-web/`: the separately deployed Iris website.

Run `npm run build` to create the complete site in `dist/`. It does not overwrite the historical tracked `public/` folder. The build rebases generated blog links/assets and creates redirects for previous article, archive, and category URLs.

Preview `dist/` with any static HTTP server. `npm run deploy` rebuilds and publishes to the existing Pages `main` branch through an isolated `.deploy_profile` checkout, retaining deployment history and using a normal fast-forward push. Source changes belong on `src`.

Resume/Explore, Iris, Open Source Contribution, and Back to Profile are in-page anchors. Contact uses `mailto:wengqiang9198@gmail.com`; the homepage GitHub link goes to the personal account. Blog opens `/blog/`; View project opens the live Iris website. The four repository cards link directly to AgentScope, deer-flow, LobeHub, and ZLMediaKit.

Motion uses CSS for hover, press/release and the one-shot halo; IntersectionObserver reveals content once when it enters the viewport. Anchor scrolling can be interrupted by wheel, touch, or navigation keys. The system reduced-motion preference disables movement. No framework runtime is needed.

Decorative SVGs and the original-color transparent Iris logo came from the approved Figma design. Repository icons use upstream artwork: AgentScope uses the logo linked in its README, deer-flow uses frontend/public/favicon.ico, and LobeHub and ZLMediaKit use their GitHub organization avatars. Cormorant Garamond is self-hosted under its SIL Open Font License.

Official icon sources:
- https://github.com/agentscope-ai/agentscope/blob/main/README.md
- https://github.com/bytedance/deer-flow/blob/main/frontend/public/favicon.ico
- https://github.com/lobehub
- https://github.com/ZLMediaKit

