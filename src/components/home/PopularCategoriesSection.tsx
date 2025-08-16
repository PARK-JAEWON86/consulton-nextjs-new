import { CategoryOption } from "./HeroSection";
import { ChevronDown } from "lucide-react";

interface PopularCategoriesSectionProps {
  categories: CategoryOption[];
  showAllCategories: boolean;
  setShowAllCategories: (value: boolean) => void;
}

export default function PopularCategoriesSection({
  categories,
  showAllCategories,
  setShowAllCategories,
}: PopularCategoriesSectionProps) {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            인기 상담 분야
          </h2>
          <p className="text-gray-600">
            많은 분들이 찾고 있는 상담 분야를 확인해보세요
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 5).map((category) => {
            const IconComponent = category.icon as any;
            return (
              <div
                key={category.id}
                className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow duration-200 cursor-pointer min-h-[160px] flex flex-col justify-center"
              >
                <div className="flex justify-center mb-3">
                  <IconComponent className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {category.description}
                </p>
              </div>
            );
          })}

          <div
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-dashed border-blue-300 hover:border-blue-400 group min-h-[160px] flex flex-col justify-center"
          >
            <div className="flex justify-center mb-3">
              <div className="bg-blue-100 rounded-full p-2 group-hover:bg-blue-200 transition-colors">
                <ChevronDown
                  className={`h-10 w-10 text-blue-600 transition-transform duration-200 ${showAllCategories ? "rotate-180" : ""}`}
                />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              {showAllCategories ? "접기" : "더 많은 분야"}
            </h3>
            <p className="text-xs text-gray-600">
              총 {categories.length}개의 상담 분야
            </p>
          </div>
        </div>

        {showAllCategories && (
          <div className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(5).map((category) => {
                const IconComponent = category.icon as any;
                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all duration-200 cursor-pointer min-h-[160px] flex flex-col justify-center"
                  >
                    <div className="flex justify-center mb-3">
                      <IconComponent className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
