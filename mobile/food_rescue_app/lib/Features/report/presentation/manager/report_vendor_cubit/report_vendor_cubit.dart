import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';
import '../../../data/models/report_vendor_request.dart';
import '../../../domain/use_cases/report_vendor_usecase.dart';

part 'report_vendor_state.dart';

class ReportVendorCubit extends Cubit<ReportVendorState> {
  ReportVendorCubit(this.reportVendorUsecase) : super(ReportVendorInitial());

  final ReportVendorUsecase reportVendorUsecase;

  Future<void> reportVendor({required ReportVendorRequest request}) async {
    emit(ReportVendorLoading());
    var result = await reportVendorUsecase.call(request);
    result.fold(
      (failure) {
        emit(ReportVendorFailure(errMessage: failure.errorMessage));
      },
      (success) {
        emit(ReportVendorSuccess());
      },
    );
  }
}
