import 'package:dartz/dartz.dart';
import '../../../../core/errors/failure.dart';
import '../../../../core/usecase/use_case.dart';
import '../../data/models/report_vendor_request.dart';
import '../repos/report_repo.dart';

class ReportVendorUsecase extends UseCase<void, ReportVendorRequest> {
  ReportVendorUsecase({required this.reportRepo});

  final ReportRepo reportRepo;
  @override
  Future<Either<Failure, void>> call(ReportVendorRequest param) async =>
      await reportRepo.reportVendor(param);
}
