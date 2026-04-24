import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../../../core/errors/failure.dart';
import '../../domain/repos/report_repo.dart';
import '../data_sources/report_remote_data_source.dart';
import '../models/report_vendor_request.dart';

class ReportRepoImpl extends ReportRepo {
  ReportRepoImpl({required this.reportRemoteDataSource});
  final ReportRemoteDataSource reportRemoteDataSource;

  @override
  Future<Either<Failure, void>> reportVendor(ReportVendorRequest request) async {
    try {
      await reportRemoteDataSource.reportVendor(request);
      return const Right(null);
    } catch (e) {
      if (e is DioException) {
        return left(ServerFailure.fromDioException(e));
      } else {
        return left(ServerFailure(errorMessage: e.toString()));
      }
    }
  }
}
