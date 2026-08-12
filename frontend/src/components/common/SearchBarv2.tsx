import { type FC, useState, type FormEvent } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchBarv2: FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [action, setAction] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState("제목");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(
        `/search?query=${encodeURIComponent(searchTerm)}&action=${action}`
      );
    }
  };

  const filters = [
    { name: "제목", value: 0 },
    { name: "작가", value: 1 },
    { name: "출판사", value: 2 },
  ];

  return (
    <div className="w-full max-w-2xl px-4 mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center w-full my-3 transition-colors bg-white rounded-full border-3 border-peach hover:border-orange">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center px-4 py-2.5 text-gray-700 hover:text-gray-900 transition-colors gap-2"
            >
              <span className="text-sm font-medium text-orange">
                {selectedFilter}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-peach transition-transform duration-200 ease-in-out ${showFilter ? "rotate-180" : ""}`}
              />
            </button>

            {showFilter && (
              <div className="absolute left-0 z-50 w-40 py-1 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg top-full">
                {filters.map((filter) => (
                  <button
                    key={filter.name}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(filter.name);
                      setAction(filter.value);
                      setShowFilter(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                      selectedFilter === filter.name
                        ? "text-orange font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-5 mx-1 bg-gray-200" />

          <div className="flex items-center flex-1 pr-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="소장 도서 검색하기"
              className="w-full px-2 py-2.5 text-sm bg-transparent focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="p-1 transition-colors rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="p-2 mr-1 transition-colors rounded-full hover:bg-gray-50"
          >
            <Search className="w-5 h-5 text-peach" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBarv2;
