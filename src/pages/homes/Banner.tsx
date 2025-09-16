import { Link } from "react-router-dom";

export default function Banner() {
    return (    
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-700 text-white">
                <div className="container mx-auto px-4 py-24 md:py-32">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Step Into Style</h1>
                        <p className="text-xl md:text-2xl mb-8 text-slate-200">
                            Discover the latest sneakers from top brands. Authentic products, fast shipping, and unbeatable prices.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8" to="/products">
                                Shop Now
                            </Link>
                            <Link className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md px-8 text-[#020817]" to="/products?featured=true">
                                Featured Products
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
    );
}