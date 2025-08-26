import { Star, Quote } from 'lucide-react';
import { reviews } from '@/data/dummy';

export default function UserReviewsSection() {



  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const topRowReviews = reviews.slice(0, 6);
  const bottomRowReviews = reviews.slice(6, 12);

  return (
    <section className="py-32 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            사용자들의 생생한 후기
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            실제로 상담을 받은 사용자들의 솔직한 리뷰를 확인해보세요
          </p>
        </div>

        {/* 첫 번째 줄 */}
        <div className="mb-8 overflow-hidden">
          <div className="flex gap-6 w-max mx-auto">
            {topRowReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-5 border border-gray-100 w-[320px] flex-shrink-0"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {review.userName.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{review.category}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600 ml-2">{review.rating}.0</span>
                    </div>
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-1 text-blue-200 w-4 h-4" />
                      <p className="text-gray-700 leading-relaxed pl-4 text-sm line-clamp-3">
                        {review.content}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 mt-3">
                      {new Date(review.date).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 두 번째 줄 */}
        <div className="overflow-hidden">
          <div className="flex gap-6 w-max mx-auto">
            {bottomRowReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-5 border border-gray-100 w-[320px] flex-shrink-0"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {review.userName.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{review.category}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600 ml-2">{review.rating}.0</span>
                    </div>
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-1 text-green-200 w-4 h-4" />
                      <p className="text-gray-700 leading-relaxed pl-4 text-sm line-clamp-3">
                        {review.content}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 mt-3">
                      {new Date(review.date).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 통계 정보 섹션 제거됨 */}
      </div>
    </section>
  );
}
