import 'package:dio/dio.dart';
import '../../../../core/constants/api_urls.dart';
import '../../../../core/database/flutter_secure_storage_service.dart';
import '../../../../core/functions/setup_service_locator.dart';
import '../../../../core/services/api_service.dart';
import '../models/report_vendor_request.dart';

abstract class ReportRemoteDataSource {
  Future<void> reportVendor(ReportVendorRequest request);
}

class ReportRemoteDataSourceImpl extends ReportRemoteDataSource {
  ReportRemoteDataSourceImpl(this._apiService);
  final ApiService _apiService;

  @override
  Future<void> reportVendor(ReportVendorRequest request) async {
    var tokens = await getIt<FlutterSecureStorageService>().getAuthToken();
    await _apiService.post(
      ApiUrls.reportUrl,
      data: request.toJson(),
      options: Options(headers: {'Authorization': 'Bearer ${tokens!.token}'}),
    );
  }
}
