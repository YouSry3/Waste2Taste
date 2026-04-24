import 'package:dartz/dartz.dart';
import '../../../../core/errors/failure.dart';
import '../../data/models/report_vendor_request.dart';

abstract class ReportRepo {
  Future<Either<Failure, void>> reportVendor(ReportVendorRequest request);
}
