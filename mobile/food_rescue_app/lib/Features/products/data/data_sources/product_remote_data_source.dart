import 'package:dio/dio.dart';
import 'package:waste2taste/core/constants/api_urls.dart';
import 'package:waste2taste/core/database/flutter_secure_storage_service.dart';
import 'package:waste2taste/core/functions/setup_service_locator.dart';
import 'package:waste2taste/core/services/api_service.dart';
import 'package:waste2taste/Features/home/data/models/product_model.dart';
import 'package:waste2taste/Features/products/data/models/add_review_model.dart';
import 'package:waste2taste/Features/products/data/models/add_review_response_model.dart';
import 'package:waste2taste/Features/products/data/models/review_model.dart';

abstract class ProductRemoteDataSource {
  Future<List<ReviewModel>> getProductReviews(String vendorId);
  Future<AddReviewResponseModel> addReview(AddReviewModel review);
  Future<void> deleteReview(int reviewId);
  Future<void> toggleFavorite(String productId);
  Future<List<ProductModel>> getFavoriteProducts();
  Future<ProductModel> getProductById(String productId);
}

class ProductRemoteDataSourceImpl implements ProductRemoteDataSource {
  final ApiService apiService;

  ProductRemoteDataSourceImpl(this.apiService);

  @override
  Future<List<ReviewModel>> getProductReviews(String vendorId) async {
    var tokens = await getIt<FlutterSecureStorageService>().getAuthToken();
    final response = await apiService.get(
      ApiUrls.getReviews,
      options: Options(
        headers: {
          'vendorId': vendorId,
          "Authorization": "Bearer ${tokens!.token}",
        },
      ),
    );

    List<ReviewModel> reviews = [];
    for (var item in response.data) {
      reviews.add(ReviewModel.fromJson(item));
    }
    return reviews;
  }

  @override
  Future<AddReviewResponseModel> addReview(AddReviewModel review) async {
    var tokens = await getIt<FlutterSecureStorageService>().getAuthToken();
    final response = await apiService.post(
      ApiUrls.addReview,
      data: review.toJson(),
      options: Options(headers: {"Authorization": "Bearer ${tokens!.token}"}),
    );
    return AddReviewResponseModel.fromJson(response.data);
  }

  @override
  Future<void> deleteReview(int reviewId) async {
    var tokens = await getIt<FlutterSecureStorageService>().getAuthToken();
    await apiService.delete(
      "${ApiUrls.deleteReview}/$reviewId",
      options: Options(headers: {"Authorization": "Bearer ${tokens!.token}"}),
    );
  }

  @override
  Future<void> toggleFavorite(String productId) async {
    var tokens = await getIt<FlutterSecureStorageService>().getAuthToken();
    await apiService.post(
      "${ApiUrls.productsUrl}/$productId/favorite",
      options: Options(headers: {"Authorization": "Bearer ${tokens!.token}"}),
    );
  }

  @override
  Future<List<ProductModel>> getFavoriteProducts() async {
    var tokens = await getIt<FlutterSecureStorageService>().getAuthToken();
    final response = await apiService.get(
      ApiUrls.myFavoritesUrl,
      options: Options(headers: {"Authorization": "Bearer ${tokens!.token}"}),
    );

    List<ProductModel> products = [];
    for (var item in response.data) {
      products.add(ProductModel.fromJson(item));
    }
    return products;
  }

  @override
  Future<ProductModel> getProductById(String productId) async {
    var tokens = await getIt<FlutterSecureStorageService>().getAuthToken();
    final response = await apiService.get(
      ApiUrls.getProductByIdUrl(productId),
      options: Options(headers: {"Authorization": "Bearer ${tokens!.token}"}),
    );
    return ProductModel.fromJson(response.data);
  }
}
