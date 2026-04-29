import { useState } from "react";
import { useConfig } from "@/context/ConfigContext";
import { IntroScreen } from "@/components/intro/IntroScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { MenuScreen } from "@/screens/MenuScreen";
import { ReelScreen } from "@/screens/ReelScreen";
import { CartPanel } from "@/components/app/CartPanel";
import type { Dish } from "@/types/config";

export type CartItem = { dish: Dish; qty: number };
export type Screen = "home" | "menu" | "reel" | "favs";

const Index = () => {
  const config = useConfig();

  const [showIntro, setShowIntro] = useState(true);
  const [screen, setScreen] = useState<Screen>("home");
  const [activeCategory, setActiveCategory] = useState(
    config.categories[0]?.id ?? ""
  );
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [reelStartDish, setReelStartDish] = useState<string | undefined>();

  const toggleFav = (id: string) =>
    setFavs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const addToCart = (dish: Dish) =>
    setCart((prev) => {
      const existing = prev.find((i) => i.dish.id === dish.id);
      if (existing)
        return prev.map((i) =>
          i.dish.id === dish.id ? { ...i, qty: i.qty + 1 } : i
        );
      return [...prev, { dish, qty: 1 }];
    });

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => i.dish.id !== id));

  const goToCategory = (catId: string) => {
    setActiveCategory(catId);
    setScreen("menu");
  };

  const goToReel = (catId: string, dishId?: string) => {
    setActiveCategory(catId);
    setReelStartDish(dishId);
    setScreen("reel");
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const favDishes = config.dishes.filter((d) => favs.has(d.id));

  return (
    <div
      className="fixed inset-0 bg-[#0D0B09] overflow-hidden"
      style={{ height: "100dvh" }}
    >
      {/* Intro overlay */}
      {showIntro && <IntroScreen onDone={() => setShowIntro(false)} />}

      {/* App body */}
      <div
        style={{
          opacity: showIntro ? 0 : 1,
          transition: "opacity 0.3s ease",
          height: "100%",
        }}
      >
        {screen === "home" && (
          <HomeScreen
            cart={cart}
            cartCount={cartCount}
            onCartOpen={() => setCartOpen(true)}
            onCategorySelect={goToCategory}
            onReelOpen={goToReel}
          />
        )}

        {screen === "menu" && (
          <MenuScreen
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onBack={() => setScreen("home")}
            onReelOpen={(dishId) => goToReel(activeCategory, dishId)}
            favs={favs}
            onToggleFav={toggleFav}
            onAddToCart={addToCart}
            cartCount={cartCount}
            onCartOpen={() => setCartOpen(true)}
          />
        )}

        {screen === "reel" && (
          <ReelScreen
            activeCategory={activeCategory}
            startDishId={reelStartDish}
            onCategoryChange={(catId) => {
              setActiveCategory(catId);
              // stay in reel, reload slides for new category
            }}
            onBack={() => setScreen("menu")}
            favs={favs}
            onToggleFav={toggleFav}
            onAddToCart={addToCart}
            cartCount={cartCount}
            onCartOpen={() => setCartOpen(true)}
          />
        )}

        {screen === "favs" && (
          <MenuScreen
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onBack={() => setScreen("home")}
            onReelOpen={(dishId) => goToReel(activeCategory, dishId)}
            favs={favs}
            onToggleFav={toggleFav}
            onAddToCart={addToCart}
            cartCount={cartCount}
            onCartOpen={() => setCartOpen(true)}
            filterFavs={favDishes}
          />
        )}
      </div>

      {/* Cart panel (overlay) */}
      <CartPanel
        items={cart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onQtyChange={(id, qty) => {
          if (qty <= 0) return removeFromCart(id);
          setCart((prev) =>
            prev.map((i) => (i.dish.id === id ? { ...i, qty } : i))
          );
        }}
      />
    </div>
  );
};

export default Index;

