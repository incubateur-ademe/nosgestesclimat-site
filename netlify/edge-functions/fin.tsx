import type { Context } from "https://edge.netlify.com";

export default async (req: Request, ctx: Context) => {
    const res:Response = await ctx.next();
    if (!res.headers.get("content-type")?.includes("text/html")) return res;
    const url = new URL(req.url);

    const ogUrl = url.origin+"/og/fin"+url.search;
    const page = await res.text();

    const title = "Nos gestes climat";
    const description = "Mes résultats de simulation.";
    const imgAlt = "Un diagrammes en barres de mon empreinte carbone comparer à l'objectif visé.";
    
    const updated = page.replace(/<!-- OG start -->(.*)<!-- OG end -->/gs,/*html*/`
    <meta name="twitter:card" content="summary_large_image" >
    <meta name="twitter:title" content="${title}" >
    <meta name="twitter:description" content="${description}" >
    <meta name="twitter:image" content="${ogUrl}">
    <meta name="twitter:image:alt" content="${imgAlt}" >
    <meta property="og:type" content="website" >
    <meta property="og:title" content="${title}" >
    <meta property="og:description" content="${description}" >
    <meta property="og:image" content="${ogUrl}" >
    <meta property="og:image:alt" content="${imgAlt}" >
    `)
    const newRes = new Response(updated, res);
    newRes.headers.delete("content-length");
    return newRes;
};
