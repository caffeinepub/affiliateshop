import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

// Migration: the previous version of this actor had stable variables
// `accessControlState` and `userProfiles` that are no longer needed.
// They are explicitly dropped via the migration system function below.

actor {
  public type Category = {
    id : Nat;
    name : Text;
  };

  public type Product = {
    id : Nat;
    title : Text;
    description : Text;
    imageUrl : Text;
    price : Text;
    category : Text;
    affiliateLink : Text;
    featured : Bool;
  };

  // ── Old stable types (for migration only) ─────────────────────────────────
  type OldUserRole = { #admin; #user; #guest };
  type OldUserProfile = { name : Text };

  // Declare the old stable vars so the runtime can read and discard them
  // during upgrade. Without these declarations the upgrade is rejected.
  stable var accessControlState : {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, OldUserRole>;
  } = {
    var adminAssigned = false;
    userRoles = Map.empty<Principal, OldUserRole>();
  };

  stable var userProfiles : Map.Map<Principal, OldUserProfile> =
    Map.empty<Principal, OldUserProfile>();

  // ── Current stable state ──────────────────────────────────────────────────
  let categories = Map.empty<Nat, Category>();
  let products = Map.empty<Nat, Product>();
  var nextCategoryId = 1;
  var nextProductId = 1;

  // ── Category Functions ────────────────────────────────────────────────────

  public shared func createCategory(name : Text) : async Category {
    let category : Category = {
      id = nextCategoryId;
      name;
    };
    categories.add(nextCategoryId, category);
    nextCategoryId += 1;
    category;
  };

  public shared func updateCategory(id : Nat, name : Text) : async Category {
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) {
        let category : Category = { id; name };
        categories.add(id, category);
        category;
      };
    };
  };

  public shared func deleteCategory(id : Nat) : async () {
    if (not categories.containsKey(id)) {
      Runtime.trap("Category not found");
    };
    categories.remove(id);
  };

  public query func getCategories() : async [Category] {
    categories.values().toArray();
  };

  // ── Product Functions ─────────────────────────────────────────────────────

  public shared func createProduct(
    title : Text,
    description : Text,
    imageUrl : Text,
    price : Text,
    category : Text,
    affiliateLink : Text,
    featured : Bool,
  ) : async Product {
    let product : Product = {
      id = nextProductId;
      title;
      description;
      imageUrl;
      price;
      category;
      affiliateLink;
      featured;
    };
    products.add(nextProductId, product);
    nextProductId += 1;
    product;
  };

  public shared func updateProduct(
    id : Nat,
    title : Text,
    description : Text,
    imageUrl : Text,
    price : Text,
    category : Text,
    affiliateLink : Text,
    featured : Bool,
  ) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let product : Product = {
          id;
          title;
          description;
          imageUrl;
          price;
          category;
          affiliateLink;
          featured;
        };
        products.add(id, product);
        product;
      };
    };
  };

  public shared func deleteProduct(id : Nat) : async () {
    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  public query func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(func(p) { p.category == category });
  };

  public query func getFeaturedProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.featured });
  };
};
