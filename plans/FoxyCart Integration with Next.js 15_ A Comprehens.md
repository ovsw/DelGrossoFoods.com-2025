<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# FoxyCart Integration with Next.js 15: A Comprehensive AI Agent Primer

This comprehensive primer provides an in-depth guide for AI agents on integrating FoxyCart with Next.js 15, covering everything from basic concepts to advanced implementation patterns. Whether you're building a simple e-commerce store or a complex multi-tenant platform, this guide will help you navigate the integration effectively.

![FoxyCart Integration Architecture with Next.js 15 - Three Integration Approaches](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/ba45928a706d31f01bb40e4d83940bd1/3cba42b6-0760-4cb8-86cd-a4928ee86250/a7667022.png)

FoxyCart Integration Architecture with Next.js 15 - Three Integration Approaches

## Introduction

### What is FoxyCart?

FoxyCart (Foxy.io) is a hosted e-commerce platform designed to seamlessly integrate with existing websites and applications. Unlike traditional e-commerce solutions that require rebuilding your entire site, FoxyCart operates on a **"bring your own frontend"** philosophy, allowing you to maintain complete control over your user experience while leveraging their robust checkout and payment processing infrastructure.[^1_1][^1_2][^1_3]

**Core FoxyCart Features:**

- **Hosted cart and checkout**: No PCI compliance burden on your servers[^1_3][^1_1]
- **Flexible product configuration**: From simple products to complex bundles with unlimited variants[^1_2][^1_1]
- **Multiple integration methods**: Simple links, HTML forms, or full API integration[^1_1][^1_3]
- **Subscription management**: Automated recurring billing with customer self-service[^1_2][^1_1]
- **Global payment support**: 100+ payment methods and gateways[^1_3][^1_1]
- **Developer-friendly APIs**: RESTful hypermedia API (hAPI) for complete programmatic control[^1_4][^1_5]

### What's New in Next.js 15?

Next.js 15 represents a significant evolution in the React ecosystem, introducing React 19 support while maintaining backward compatibility with React 18. Key improvements include enhanced Server Components, refined data fetching patterns, and better performance optimizations.[^1_6][^1_7]

**Next.js 15 Key Features:**

- **React 19 Integration**: Access to the latest React features including improved concurrent rendering[^1_6]
- **Enhanced App Router**: Better caching strategies and improved client router cache control[^1_6]
- **Server Actions Evolution**: Transition from POST-only Server Actions to more flexible Server Functions[^1_8][^1_9]
- **Improved Data Fetching**: Better async/await patterns in Server Components with request memoization[^1_10][^1_11]
- **Performance Optimizations**: Faster static generation, improved HMR cache, and better bundling[^1_6]
- **ESLint 9 Support**: Modern linting with flat config format[^1_6]

### Why Integrate FoxyCart with Next.js 15?

The combination of FoxyCart's hosted commerce capabilities with Next.js 15's modern React architecture creates a powerful development stack that addresses common e-commerce challenges.[^1_1][^1_12]

**Benefits of Integration:**

- **Rapid Development**: Skip complex payment processing implementation while maintaining custom UX[^1_12][^1_1]
- **Modern Architecture**: Leverage React 19 features with proven e-commerce infrastructure[^1_6]
- **Flexible Deployment**: Choose from simple hosted checkout to fully custom implementations[^1_2][^1_1]
- **Performance**: Server Components for fast initial loads, client components for interactive features[^1_11][^1_7]
- **SEO Optimization**: Server-side rendering for product pages with dynamic checkout[^1_6][^1_11]
- **Security**: FoxyCart handles PCI compliance while you focus on user experience[^1_5][^1_1]

## FoxyCart Architecture Overview

### Hosted Cart \& Checkout

FoxyCart's hosted approach means that sensitive payment processing occurs on their secure infrastructure, not your servers. This architecture provides several key advantages:[^1_1][^1_3]

**Integration Methods:**

1. **Link-Based Integration**: Simple URLs that redirect to FoxyCart checkout[^1_13][^1_1]
2. **Form-Based Integration**: HTML forms that post to FoxyCart endpoints[^1_14][^1_1]
3. **JavaScript Integration**: Embedded sidecart and checkout overlays[^1_1][^1_14]
4. **API Integration**: Full programmatic control via the hAPI[^1_4][^1_15]

**Checkout Flow:**

- Customer adds products to cart on your site
- Cart data is passed to FoxyCart (via URL parameters, form data, or API)
- FoxyCart handles secure checkout process
- Customer returns to your site after successful payment
- Webhooks notify your system of completed transactions

### Hypermedia API (hAPI)

The FoxyCart Hypermedia API follows REST and HATEOAS principles, providing discoverable endpoints and relationships. This design allows for robust integrations that can evolve independently of the client implementation.[^1_4][^1_15][^1_16]

**API Characteristics:**

- **RESTful Design**: Standard HTTP verbs (GET, POST, PUT, PATCH, DELETE)[^1_15][^1_4]
- **Hypermedia-Driven**: Link relationships guide API navigation[^1_4][^1_15]
- **Versioned**: API version specified in headers for backward compatibility[^1_5][^1_15]
- **Comprehensive**: Covers stores, products, customers, transactions, subscriptions[^1_15][^1_4]

**Core Resources:**

- **Stores**: Store configuration and settings
- **Items**: Product catalog and inventory management
- **Customers**: Customer accounts and information
- **Transactions**: Order data and processing
- **Subscriptions**: Recurring billing management
- **Coupons**: Discount and promotion handling

### Authentication \& Security

FoxyCart implements OAuth 2.0 for API authentication, ensuring secure access to sensitive commerce data. The system supports multiple integration patterns depending on your application's needs.[^1_5]

**OAuth Flow Types:**

1. **Standalone Integration**: Single store, direct token generation[^1_5]
2. **Third-Party Integration**: Users authorize your app to access their stores[^1_5]
3. **White-Label Integration**: Your app manages user stores transparently[^1_5]

**Security Features:**

- **OAuth 2.0 Standard**: Industry-standard authentication framework[^1_5]
- **Token Management**: Access tokens (2-hour expiry) and refresh tokens (10-year expiry)[^1_5]
- **HMAC Validation**: Cryptographic verification of cart data integrity[^1_1][^1_17]
- **PCI Compliance**: FoxyCart maintains PCI DSS compliance for payment processing[^1_1]

### Integration Patterns

Based on the research, three primary integration patterns emerge, each suited to different requirements and technical constraints:

**1. Frontend-Only Integration (Hosted Cart)**

- Simplest implementation requiring no backend changes
- Products displayed using Next.js, cart managed by FoxyCart
- Ideal for content-managed sites or simple stores
- Minimal development overhead

**2. Full-Stack Integration (hAPI)**

- Complete programmatic control over the commerce experience
- Custom cart, checkout, and order management
- Requires OAuth setup and API integration
- Maximum flexibility and customization

**3. Hybrid Approach**

- Combines hosted checkout with custom product display
- Selective use of hAPI for specific features
- Balance between simplicity and customization
- Common for established applications adding e-commerce

## Next.js 15 Key Features for E-commerce

### App Router and Server Components

The App Router in Next.js 15 provides a file-system based routing architecture that leverages React's Server Components for optimal performance. This is particularly beneficial for e-commerce applications where initial page load speed directly impacts conversion rates.[^1_18][^1_19]

**Server Component Benefits for E-commerce:**

- **SEO Optimization**: Product pages rendered server-side for search engines[^1_11][^1_19]
- **Performance**: Reduced JavaScript bundle size for faster initial loads[^1_19][^1_18]
- **Data Security**: Sensitive operations (API keys, database queries) remain on server[^1_11][^1_19]
- **Automatic Code Splitting**: Components loaded only when needed[^1_18]

**Implementation Pattern:**

```typescript
// Server Component for product catalog
export default async function ProductsPage() {
  const products = await fetchProducts(); // Runs on server

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Server Actions vs API Routes

Next.js 15 evolves the relationship between Server Actions and API Routes, providing clearer guidance on when to use each approach. Understanding this distinction is crucial for FoxyCart integrations.[^1_8][^1_9]

**Server Actions (Recommended for):**

- Form submissions and mutations within your Next.js app[^1_9][^1_8]
- Cart operations, product updates, user actions[^1_8][^1_9]
- Simplified error handling and TypeScript integration[^1_9][^1_8]
- Direct function calls without HTTP overhead[^1_8][^1_9]

**API Routes (Recommended for):**

- External system integration (FoxyCart webhooks)[^1_9][^1_8]
- Third-party application access to your data[^1_8][^1_9]
- GET requests for data fetching from external clients[^1_9][^1_8]
- Complex authentication flows[^1_8][^1_9]

**Server Action Example:**

```typescript
"use server";

export async function addToCartAction(productId: string, quantity: number) {
  // Direct server-side execution
  const cart = await updateCart(productId, quantity);
  revalidatePath("/cart");
  return { success: true, cart };
}
```

### Data Fetching Patterns

Next.js 15 introduces improved data fetching patterns that are particularly relevant for e-commerce applications handling multiple data sources.[^1_10][^1_11][^1_20]

**Sequential vs Parallel Fetching:**

- **Sequential**: One request waits for another (use when data dependencies exist)[^1_11][^1_10]
- **Parallel**: Multiple requests execute simultaneously (use for independent data)[^1_10][^1_11]

**Recommended E-commerce Patterns:**

```typescript
// Parallel fetching for independent data
export default async function ProductPage({ params }) {
  const productPromise = getProduct(params.id);
  const reviewsPromise = getProductReviews(params.id);
  const relatedPromise = getRelatedProducts(params.id);

  const [product, reviews, related] = await Promise.all([
    productPromise,
    reviewsPromise,
    relatedPromise
  ]);

  return <ProductDetails product={product} reviews={reviews} related={related} />;
}
```

### Client Components and State Management

While Server Components handle initial rendering, Client Components manage interactive features essential for e-commerce user experience. Modern state management solutions like Zustand provide lightweight alternatives to more complex libraries.[^1_19][^1_21]

**Client Component Use Cases:**

- Shopping cart interactions and state management[^1_21][^1_22]
- Product filters and search interfaces[^1_22][^1_21]
- User authentication status[^1_21][^1_22]
- Real-time inventory updates[^1_22][^1_21]

**State Management with Zustand:**

```typescript
// Cart store with persistence
const useCartStore = create()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => ({
          items: [...state.items, product],
        })),
      generateFoxyCartUrl: (storeSubdomain) => {
        // Convert cart state to FoxyCart URL
        const items = get().items;
        return buildFoxyCartUrl(storeSubdomain, items);
      },
    }),
    { name: "cart-storage" },
  ),
);
```

## Integration Strategies

### Frontend-Only Integration (Hosted Cart)

The frontend-only approach represents the simplest path to e-commerce functionality with minimal backend complexity. This pattern works particularly well for content-managed sites, marketing sites, or applications where speed to market is critical.[^1_1][^1_13]

**Implementation Approach:**

1. Display products using Next.js Server Components
2. Generate FoxyCart URLs for cart operations
3. Redirect users to hosted checkout for payment
4. Handle return flow after successful transactions

**Key Advantages:**

- **Rapid Implementation**: Can be completed in hours rather than weeks[^1_23]
- **No Backend Requirements**: Ideal for static sites or JAMstack architecture[^1_2][^1_1]
- **Automatic PCI Compliance**: Payment processing handled entirely by FoxyCart[^1_1]
- **Built-in Features**: Cart abandonment, customer accounts, and subscription management included[^1_24][^1_1]

**Considerations:**

- Limited customization of checkout experience
- Dependency on FoxyCart's template system for branding
- Less control over customer data and analytics
- Potential for inconsistent user experience during checkout transition

### Full-Stack Integration (hAPI)

The full-stack approach provides maximum flexibility and control by leveraging FoxyCart's hypermedia API for all commerce operations. This pattern suits applications requiring custom checkout flows, complex product configurations, or deep analytics integration.[^1_4][^1_15]

**Implementation Components:**

1. OAuth 2.0 authentication for hAPI access[^1_5]
2. Server Components for product data fetching[^1_11]
3. Server Actions for cart and order management[^1_8]
4. Custom checkout UI with payment tokenization
5. Webhook handling for order processing[^1_17]

**Technical Architecture:**

- **Authentication Layer**: OAuth token management and refresh logic[^1_5]
- **Data Layer**: API abstraction for FoxyCart resources[^1_15][^1_4]
- **State Management**: Client-side cart state synchronized with server[^1_21][^1_22]
- **Webhook Processing**: Real-time order updates and inventory management[^1_17]

**Advanced Capabilities:**

- Custom subscription management interfaces
- Complex product bundling and pricing rules
- Integrated customer support and order management
- Advanced analytics and reporting integration

### Hybrid Approach

The hybrid strategy combines the simplicity of hosted checkout with selective API integration for enhanced functionality. This balanced approach allows teams to start simple and gradually add complexity as requirements evolve.[^1_1][^1_2]

**Common Hybrid Patterns:**

1. **Product Management**: Use hAPI for inventory, hosted checkout for payments
2. **Customer Integration**: Custom user accounts with FoxyCart subscription management
3. **Analytics Enhancement**: Track cart behavior locally, process payments via hosted checkout
4. **Progressive Enhancement**: Start with links, add JavaScript sidecart over time

**Implementation Strategy:**

```typescript
// Hybrid cart component
export function HybridCart() {
  const { items, generateFoxyUrl } = useCartStore();
  const [showSidecart, setShowSidecart] = useState(false);

  return (
    <>
      <CartSummary items={items} onClick={() => setShowSidecart(true)} />
      {showSidecart && (
        <FoxySidecart
          storeSubdomain={process.env.NEXT_PUBLIC_FOXY_SUBDOMAIN}
          cartUrl={generateFoxyUrl()}
          onClose={() => setShowSidecart(false)}
        />
      )}
    </>
  );
}
```

## Implementation Guide

### Project Setup

Begin with a Next.js 15 project configured for TypeScript and Tailwind CSS, which provides the foundation for a modern e-commerce application.[^1_6][^1_7]

**Initial Setup Commands:**

```bash
npx create-next-app@latest my-foxy-store \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir

cd my-foxy-store
npm install zustand lucide-react
```

### Environment Configuration

Proper environment variable management is crucial for secure FoxyCart integration, particularly when handling OAuth credentials and webhook secrets.[^1_5]

**Security Best Practices:**

- Never expose access tokens or secrets in client-side code
- Use Next.js `NEXT_PUBLIC_` prefix only for safe public values
- Implement proper token refresh logic for long-running applications
- Validate webhook signatures to prevent unauthorized requests

### Product Display Components

Create reusable components that can work with either static product data or API-fetched inventory. The component architecture should support both simple and complex product configurations.[^1_11]

**Component Hierarchy:**

- `ProductGrid`: Container component for product listings
- `ProductCard`: Individual product display with cart integration
- `ProductForm`: Advanced component for product variants and options
- `ProductImage`: Optimized image display with Next.js Image component

### Cart Integration

Implement cart functionality that can work with FoxyCart's various integration methods while providing a smooth user experience.[^1_21][^1_22]

**State Management Strategy:**

- Use Zustand for lightweight client-side state management
- Persist cart data in localStorage for session continuity
- Sync cart state with FoxyCart URLs for checkout
- Handle edge cases like browser refresh and network issues

### Checkout Flow

Design the checkout experience to seamlessly transition between your application and FoxyCart while maintaining brand consistency.[^1_1][^1_24]

**Checkout Implementation Options:**

1. **Direct Redirect**: Simple URL-based cart handoff
2. **Embedded Sidecart**: JavaScript-based overlay checkout
3. **Custom Checkout**: Full API integration with payment tokenization
4. **Progressive Enhancement**: Start simple, add features incrementally

### Order Management

Implement webhook handling to process completed transactions and update your application state.[^1_17]

**Webhook Processing:**

- Verify webhook signatures for security
- Handle idempotent processing for duplicate webhooks
- Update inventory and customer records
- Trigger fulfillment processes
- Send confirmation emails and notifications

## Advanced Topics

### Authentication \& Customer Portal

FoxyCart provides customer portal functionality that can be integrated with your existing authentication system. This enables seamless user experiences where customers can manage subscriptions, view order history, and update payment information.[^1_24]

**Single Sign-On Integration:**

- Configure FoxyCart SSO in store settings[^1_24]
- Implement JWT token generation for customer authentication
- Handle login state synchronization between systems
- Provide consistent user experience across platforms

**Customer Portal Features:**

- Subscription management and cancellation[^1_24]
- Order history and tracking information
- Payment method updates
- Address book management
- Download digital products and invoices

### Webhooks and Order Processing

Webhook implementation is crucial for maintaining accurate order status and inventory levels. FoxyCart sends webhooks for various events including successful transactions, subscription modifications, and refund processing.[^1_17]

**Webhook Event Types:**

- `transaction/created`: New order completed
- `subscription/created`: New subscription started
- `subscription/modified`: Subscription changes
- `customer/created`: New customer account
- `transaction/voided`: Order cancellation or refund

**Processing Implementation:**

```typescript
// Webhook handler example
export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("X-Foxy-Webhook-Signature");

  if (!verifyWebhookSignature(payload, signature)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const event = JSON.parse(payload);
  await processWebhookEvent(event);

  return new Response("OK");
}
```

### Custom Templates

FoxyCart allows extensive customization of the checkout experience through Twig-based templates. This enables brands to maintain visual consistency throughout the purchase process.[^1_25][^1_26]

**Customization Areas:**

- Checkout page layout and styling[^1_26]
- Cart display and interaction[^1_27]
- Email receipts and notifications
- Customer portal appearance[^1_24]
- Error messages and validation

**Template Development:**

- Use Twig templating syntax for dynamic content
- Include custom CSS and JavaScript for enhanced UX
- Implement responsive design for mobile optimization
- Test across different payment methods and scenarios

### Performance Optimization

Optimize your FoxyCart integration for both development and production environments, leveraging Next.js 15's performance improvements.[^1_6][^1_20]

**Optimization Strategies:**

- **Image Optimization**: Use Next.js Image component for product photos
- **Code Splitting**: Lazy load cart components and checkout scripts
- **Caching**: Implement proper cache headers for static product data
- **Bundle Analysis**: Monitor JavaScript bundle size and optimize imports
- **CDN Integration**: Leverage FoxyCart's CDN for cart scripts and assets

## Best Practices \& Troubleshooting

### Security Considerations

Security in e-commerce applications requires attention to both FoxyCart-specific concerns and general web application security principles.

**FoxyCart Security Features:**

- **HMAC Validation**: Verify cart data integrity using store secret[^1_1][^1_17]
- **HTTPS Enforcement**: All FoxyCart interactions require SSL/TLS
- **Payment Tokenization**: Credit card data never touches your servers
- **Webhook Signatures**: Cryptographic verification of webhook authenticity[^1_17]

**Implementation Best Practices:**

- Store sensitive credentials in environment variables, never in code
- Validate all user input before passing to FoxyCart APIs
- Implement rate limiting for API endpoints
- Use Content Security Policy headers to prevent XSS attacks
- Regularly rotate OAuth tokens and webhook secrets

### Performance Tips

Optimize your integration for speed and reliability, particularly important for e-commerce conversion rates.

**Next.js 15 Optimizations:**

- **Server Components**: Use for product catalogs and static content[^1_11][^1_19]
- **Parallel Fetching**: Load independent data simultaneously[^1_10][^1_11]
- **Image Optimization**: Leverage Next.js Image component with proper sizing[^1_6]
- **Caching Strategies**: Implement appropriate cache headers for API responses[^1_6]

**FoxyCart Optimizations:**

- **Preload Scripts**: Include FoxyCart JavaScript in document head
- **Cart State Management**: Minimize API calls through smart state management
- **Template Optimization**: Reduce checkout page load time with optimized templates
- **CDN Usage**: Leverage FoxyCart's global CDN for cart assets

### Common Pitfalls

Avoid these frequent integration issues that can impact user experience and conversion rates:

**Authentication Issues:**

- **Token Expiration**: Implement proper refresh logic for OAuth tokens[^1_5]
- **Scope Limitations**: Ensure OAuth scope matches required API operations[^1_5]
- **CORS Configuration**: Properly configure cross-origin requests for API calls[^1_5]

**State Management Problems:**

- **Cart Synchronization**: Maintain consistency between client state and FoxyCart
- **Browser Refresh**: Handle cart persistence across page reloads
- **Multiple Tabs**: Manage cart state when users open multiple browser tabs
- **Network Failures**: Implement proper error handling for API failures

**Checkout Experience Issues:**

- **Brand Consistency**: Ensure smooth visual transition to FoxyCart checkout
- **Mobile Optimization**: Test checkout flow on various mobile devices
- **Payment Methods**: Verify all required payment options are properly configured
- **Error Handling**: Provide clear messaging for failed transactions

### Debugging Tools

Effective debugging accelerates development and helps identify issues in production environments.

**FoxyCart Development Tools:**

- **API Explorer**: Interactive tool for testing hAPI endpoints[^1_4]
- **Webhook Testing**: Tools for simulating webhook events locally
- **Template Debugger**: Console tools for troubleshooting Twig templates
- **Store Configuration**: Admin interface for testing store settings

**Next.js 15 Debugging:**

- **React Developer Tools**: Inspect component state and props
- **Network Tab**: Monitor API requests and responses
- **Server Component Debugging**: Use logging for server-side issues[^1_28]
- **Build Analysis**: Analyze bundle size and performance metrics[^1_6]

**Integration Debugging:**

```typescript
// Debug utility for FoxyCart integration
export const debugFoxyCart = {
  logCartState: (cart) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Cart State:", cart);
    }
  },

  validateEnvironment: () => {
    const required = ["NEXT_PUBLIC_FOXY_SUBDOMAIN", "FOXY_ACCESS_TOKEN"];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      console.error("Missing environment variables:", missing);
    }
  },
};
```

## Conclusion

Integrating FoxyCart with Next.js 15 creates a powerful e-commerce development stack that combines modern React architecture with proven payment processing infrastructure. The three integration approaches—frontend-only, full-stack, and hybrid—provide flexibility to match your specific requirements and technical constraints.

**Key Success Factors:**

- **Choose the Right Pattern**: Start with frontend-only for simplicity, evolve to full-stack for customization
- **Leverage Next.js 15 Features**: Use Server Components for performance, Server Actions for mutations
- **Implement Proper Security**: Follow OAuth best practices and validate all data exchanges
- **Optimize Performance**: Use parallel data fetching and proper caching strategies
- **Plan for Scale**: Design your integration to grow with your business needs

The combination of FoxyCart's hosted commerce capabilities with Next.js 15's modern development patterns enables rapid development of secure, performant e-commerce applications. Whether building a simple product catalog or a complex multi-vendor marketplace, this integration provides a solid foundation for e-commerce success.

**Next Steps:**

1. Set up a FoxyCart development account and explore the admin interface
2. Create a Next.js 15 project using the recommended project structure
3. Implement a basic frontend-only integration to understand the fundamentals
4. Gradually enhance with hAPI integration as requirements demand more customization
5. Deploy with proper security measures and performance monitoring

This primer provides the foundation for successful FoxyCart and Next.js 15 integration. As both platforms continue to evolve, stay current with their documentation and community resources to leverage new features and best practices.
<span style="display:none">[^1_29][^1_30][^1_31][^1_32][^1_33][^1_34][^1_35][^1_36][^1_37][^1_38][^1_39][^1_40][^1_41][^1_42][^1_43][^1_44][^1_45][^1_46][^1_47][^1_48][^1_49][^1_50][^1_51][^1_52][^1_53][^1_54][^1_55][^1_56][^1_57][^1_58][^1_59][^1_60][^1_61][^1_62][^1_63][^1_64][^1_65][^1_66][^1_67][^1_68][^1_69][^1_70][^1_71][^1_72][^1_73][^1_74][^1_75][^1_76][^1_77][^1_78][^1_79][^1_80][^1_81][^1_82]</span>

<div align="center">⁂</div>

[^1_1]: https://www.foxy.io/blog/create-an-online-store-with-notion-and-foxy

[^1_2]: https://www.foxy.io/help/articles/build-an-online-store-with-lovable-ai-prompts-supabase-and-foxy

[^1_3]: https://www.foxy.io

[^1_4]: https://api.foxycart.com

[^1_5]: https://api.foxycart.com/docs/authentication

[^1_6]: https://nextjs.org/blog/next-15

[^1_7]: https://javascript.plainenglish.io/nextjs-15-features-b30d575f8dd7

[^1_8]: https://makerkit.dev/blog/tutorials/server-actions-vs-route-handlers

[^1_9]: https://www.wisp.blog/blog/server-actions-vs-api-routes-in-nextjs-15-which-should-i-use

[^1_10]: https://nextjs.org/docs/14/app/building-your-application/data-fetching/patterns

[^1_11]: https://nextjs.org/docs/app/getting-started/fetching-data

[^1_12]: https://dev.to/alex_rapp_58f44471ada3639/build-a-full-stack-ecommerce-app-with-nextjs-15-a-step-by-step-guide-6f3

[^1_13]: https://uskinned.net/support/how-to-create-ecommerce-ready-product-pages-with-foxyio/

[^1_14]: https://github.com/backdrop-contrib/foxycart

[^1_15]: https://foxyhapi.docs.apiary.io

[^1_16]: https://api.foxycart.com/docs/reference

[^1_17]: https://support.efrontlearning.com/hc/en-us/articles/114094001771-How-to-integrate-Foxy-cart-with-your-portal

[^1_18]: https://nextjs.org/docs/app

[^1_19]: https://nextjs.org/docs/app/getting-started/server-and-client-components

[^1_20]: https://robotostudio.com/blog/optimized-data-fetching-in-nextjs-15

[^1_21]: https://dev.to/blamsa0mine/building-a-modern-e-commerce-app-with-nextjs-15-zustand-and-typescript-18i5

[^1_22]: https://www.pedroalonso.net/blog/react-state-management-zustand/

[^1_23]: https://www.foxy.io/blog/easy-to-setup-ecommerce-in-5-minutes

[^1_24]: https://www.foxy.io/help/articles/set-up-a-customer-portal

[^1_25]: https://foxy-shop.com/category/foxyshop-tips/

[^1_26]: https://api.foxycart.com/rels/checkout_template

[^1_27]: https://api.foxycart.com/rels/cart_include_template

[^1_28]: https://www.youtube.com/watch?v=WKfPctdIDek

[^1_29]: https://www.npmjs.com/package/@foxy.io/node-api

[^1_30]: https://api.foxycart.com/docs/tutorials/foxyclient

[^1_31]: https://docs.connect.worldline-solutions.com/documentation/sdk/mobile/javascript/

[^1_32]: https://www.linkedin.com/posts/saajansangha_lets-build-a-full-stack-e-commerce-app-activity-7257996993229164544-eLJ0

[^1_33]: https://www.foxy.io/audiences/developers

[^1_34]: https://www.youtube.com/watch?v=DLeAPn5-TIA

[^1_35]: https://bejamas.com/hub/guides/how-to-build-an-e-commerce-storefront-with-next-js-and-shopify

[^1_36]: https://www.npmjs.com/package/@foxy.io/sdk

[^1_37]: https://vercel.com/templates/next.js/nextjs-commerce

[^1_38]: https://www.youtube.com/watch?v=cvK1n-Rv2qk

[^1_39]: https://api.foxycart.com/docs/permissions

[^1_40]: https://strapi.io/blog/epic-next-js-15-tutorial-part-1-learn-next-js-by-building-a-real-life-project

[^1_41]: https://docs.treasuredata.com/articles/pd/working-with-the-js-sdk

[^1_42]: https://curity.io/resources/learn/what-is-hypermedia-authentication-api/

[^1_43]: https://dev.to/mukulwebdev/shopify-store-integration-in-the-reactjsnextjs-1h2f

[^1_44]: https://docs.snipcart.com/v3/sdk/api

[^1_45]: https://hypermedia.systems/json-data-apis/

[^1_46]: https://www.youtube.com/watch?v=Cf2lG6qXhTQ

[^1_47]: https://documenter.getpostman.com/view/3967924/RW1hhvWk

[^1_48]: https://www.reddit.com/r/nextjs/comments/13vt7s6/building_a_fullyfeatured_ecommerce_storefront_in/

[^1_49]: https://docs.knock.app/in-app-ui/javascript/sdk/reference

[^1_50]: https://nordicapis.com/authentication-as-a-hypermedia-api/

[^1_51]: https://www.commerceworm.com/articles/nextjs-shopify-storefront-tutorial

[^1_52]: https://hapi.dev/plugins/

[^1_53]: https://spreecommerce.org/next-js-commerce-the-go-to-framework-for-building-modern-storefronts/

[^1_54]: https://www.slideshare.net/LukeStokes

[^1_55]: https://dev.to/anggakswr/optimizing-nextjs-15-app-router-with-templatetsx-and-customproviders-2e09

[^1_56]: https://www.reddit.com/r/nextjs/comments/1mbjs26/server_actions_vs_api_routes_for_largescale/

[^1_57]: https://stackoverflow.com/questions/79457679/server-actions-vs-api-routes-when-to-use-what

[^1_58]: https://nextjs.org/docs/14/app/building-your-application/data-fetching/server-actions-and-mutations

[^1_59]: https://www.reddit.com/r/reactjs/comments/1ldn04a/mastering_data_fetching_in_nextjs_15_react_19/

[^1_60]: https://nextjs.org/blog

[^1_61]: https://www.youtube.com/watch?v=NWx8oVLEdwE

[^1_62]: https://dev.to/joodi/fetching-data-with-axios-in-nextjs-15-a-complete-guide-hed

[^1_63]: https://www.dhiwise.com/blog/design-converter/nextjs-15-2-new-features-and-updates-you-should-know

[^1_64]: https://nextjs.org/docs/app/getting-started/updating-data

[^1_65]: https://www.2checkout.com/online-shopping-carts/foxycart.html

[^1_66]: https://www.reddit.com/r/nextjs/comments/19cv9pr/how_do_you_create_a_persistent_shopping_cart/

[^1_67]: https://wordpress.org/plugins/foxyshop/

[^1_68]: https://www.postaffiliatepro.com/integration-methods/foxycart/

[^1_69]: https://stackoverflow.com/questions/50982114/foxycart-credit-card-payment-testing

[^1_70]: https://www.youtube.com/watch?v=4Zvr3w9TakQ

[^1_71]: https://discourse.webflow.com/t/can-i-create-foxycart-checkout-cart-and-side-carts-in-webflow/153454

[^1_72]: https://github.com/Mo-Ibra/nextjs-clean-ecommerce

[^1_73]: https://hackernoon.com/how-to-build-a-shopping-cart-with-nextjs-and-zustand-state-management-with-typescript

[^1_74]: https://api.foxycart.com/rels/store_version

[^1_75]: https://dev.to/moibra/i-built-a-clean-modern-nextjs-e-commerce-template-and-you-can-use-it-or-contribute-2d0i

[^1_76]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/ba45928a706d31f01bb40e4d83940bd1/985f5cdb-e763-487a-ad05-9b773529b5d2/69c3ff6e.tsx

[^1_77]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/ba45928a706d31f01bb40e4d83940bd1/985f5cdb-e763-487a-ad05-9b773529b5d2/172a15d9.tsx

[^1_78]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/ba45928a706d31f01bb40e4d83940bd1/985f5cdb-e763-487a-ad05-9b773529b5d2/7b1f733a.tsx

[^1_79]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/ba45928a706d31f01bb40e4d83940bd1/985f5cdb-e763-487a-ad05-9b773529b5d2/5dffaabd.tsx

[^1_80]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/ba45928a706d31f01bb40e4d83940bd1/985f5cdb-e763-487a-ad05-9b773529b5d2/a41eb54f.tsx

[^1_81]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/ba45928a706d31f01bb40e4d83940bd1/985f5cdb-e763-487a-ad05-9b773529b5d2/37808f9b.tsx

[^1_82]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/ba45928a706d31f01bb40e4d83940bd1/97f83212-cf49-4ca6-8bcc-5eddd7d6f027/7ae45ad1.json
