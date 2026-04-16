import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { useListings } from "./api/listing.queries";
import { useUpdateListing, useDeleteListing } from "./api/listing.mutations";
import { ListingCard } from "./components/ListingCard";

export function MyListings() {
  const navigate = useNavigate();

  /* -------------------- API -------------------- */
  const { data, isLoading, error } = useListings();

  const listings = data?.listings || [];
  const activeCount = data?.activeCount || 0;

  const { mutate: updateListing } = useUpdateListing();
  const { mutate: deleteListing } = useDeleteListing();

  /* -------------------- FILTERS -------------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  /* -------------------- FILTER LOGIC -------------------- */
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesSearch =
        searchTerm === "" ||
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.vendor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || listing.category === filterCategory;

      const matchesStatus =
        filterStatus === "all" || listing.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [listings, searchTerm, filterCategory, filterStatus]);

  /* -------------------- LOADING / ERROR -------------------- */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        Failed to load listings
      </div>
    );
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="p-8 mt-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Food Listings</h1>
          <p className="text-gray-500">
            Manage surplus food listings • {activeCount} active
          </p>
        </div>

        {/* ✅ RESTORED BUTTON */}
        <Button
          onClick={() => navigate("/panel/vendor/create-listing")}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Listing
        </Button>
      </div>

      {/* EMPTY STATE */}
      {filteredListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center border rounded-2xl bg-gray-50">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <Plus className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            No listings found
          </h2>

          <p className="text-gray-500 mt-2 max-w-md">
            {searchTerm || filterCategory !== "all" || filterStatus !== "all"
              ? "No listings match your filters. Try adjusting your search."
              : "You haven't created any listings yet. Start by adding your first one."}
          </p>

          {!searchTerm &&
            filterCategory === "all" &&
            filterStatus === "all" && (
              <Button
                onClick={() => navigate("/panel/vendor/create-listing")}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Listing
              </Button>
            )}
        </div>
      ) : (
        /* GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onEdit={(item) =>
                updateListing({
                  id: item.id,
                  data: item,
                })
              }
              onDelete={(id) => deleteListing(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
