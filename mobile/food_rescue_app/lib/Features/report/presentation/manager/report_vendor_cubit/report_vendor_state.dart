part of 'report_vendor_cubit.dart';

@immutable
sealed class ReportVendorState {}

final class ReportVendorInitial extends ReportVendorState {}

final class ReportVendorLoading extends ReportVendorState {}

final class ReportVendorSuccess extends ReportVendorState {}

final class ReportVendorFailure extends ReportVendorState {
  final String errMessage;

  ReportVendorFailure({required this.errMessage});
}
