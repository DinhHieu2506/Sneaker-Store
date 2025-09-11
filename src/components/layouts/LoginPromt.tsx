
import { ShoppingBag } from 'lucide-react'; // Đảm bảo bạn đã cài đặt lucide-react

const LoginPrompt = () => {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-muted-foreground mb-8">You need to login to view your cart</p>
        <a
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          href="/auth/login"
        >
          Login
        </a>
      </div>
    </main>
  );
};

export default LoginPrompt;