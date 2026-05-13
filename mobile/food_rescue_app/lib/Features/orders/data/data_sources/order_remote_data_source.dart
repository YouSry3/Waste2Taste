import 'package:dio/dio.dart';
import '../../../../../core/constants/api_urls.dart';
import '../../../../../core/database/flutter_secure_storage_service.dart';
import '../../../../../core/functions/setup_service_locator.dart';
import '../../../../../core/services/api_service.dart';
import '../models/reserve_order_request_model.dart';
import '../models/reserve_order_response_model.dart';

abstract class OrderRemoteDataSource {
  Future<ReserveOrderResponseModel> reserveOrder(ReserveOrderRequestModel requestModel);
}

class OrderRemoteDataSourceImpl extends OrderRemoteDataSource {
  final ApiService apiService;

  OrderRemoteDataSourceImpl(this.apiService);

  @override
  Future<ReserveOrderResponseModel> reserveOrder(ReserveOrderRequestModel requestModel) async {
    final storage = getIt.get<FlutterSecureStorageService>();
    final userKeys = await storage.getAuthToken();
    final token = userKeys?.token ?? '';
    var response = await apiService.post(
      ApiUrls.reserveOrderUrl,
      data: requestModel.toJson(),
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );
    return ReserveOrderResponseModel.fromJson(response.data);
  }
}
