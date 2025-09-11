
export default function Footer() {
  const SocialIcon = ({ d }: { d: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d={d}></path>
        </svg>
    );

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl">SneakerHub</span>
            </div>
            <p className="text-gray-400 mb-4">Your ultimate destination for authentic sneakers from top brands worldwide.</p>
            <div className="flex space-x-4">
                <a className="text-gray-400 hover:text-white" href="#"><SocialIcon d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></a>
                <a className="text-gray-400 hover:text-white" href="#"><SocialIcon d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></a>
                {/* Instagram icon needs multiple elements, so we'll do it separately */}
                <a className="text-gray-400 hover:text-white" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a className="hover:text-white" href="/products">All Products</a></li>
              <li><a className="hover:text-white" href="/products?gender=Men">Men</a></li>
              <li><a className="hover:text-white" href="/products?gender=Women">Women</a></li>
              <li><a className="hover:text-white" href="/products?featured=true">Featured</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a className="hover:text-white" href="/">Contact Us</a></li>
              <li><a className="hover:text-white" href="/">Shipping Info</a></li>
              <li><a className="hover:text-white" href="/">Returns</a></li>
              <li><a className="hover:text-white" href="/">Size Guide</a></li>
              <li><a className="hover:text-white" href="/">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a className="hover:text-white" href="/auth/login">Sign In</a></li>
              <li><a className="hover:text-white" href="/auth/signup">Create Account</a></li>
              <li><a className="hover:text-white" href="/">My Account</a></li>
              <li><a className="hover:text-white" href="/">Order History</a></li>
              <li><a className="hover:text-white" href="/wishlist">Wishlist</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 SneakerHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}