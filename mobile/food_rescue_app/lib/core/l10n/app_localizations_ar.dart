// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Arabic (`ar`).
class AppLocalizationsAr extends AppLocalizations {
  AppLocalizationsAr([String locale = 'ar']) : super(locale);

  @override
  String get skip => 'تخطي';

  @override
  String get getStarted => 'ابدأ';

  @override
  String get next => 'التالي';

  @override
  String get rescueFoodTitle => 'أنقذ طعامًا رائعًا';

  @override
  String get rescueFoodDesc =>
      'اعثر على وجبات عالية الجودة بخصم يصل إلى ٧٠٪ وساهم في حماية الكوكب';

  @override
  String get premiumMealsTitle => 'وجبات مميزة بأسعار أفضل';

  @override
  String get premiumMealsDesc =>
      'استمتع بطعام طازج وعالي الجودة بأسعار مذهلة واحجز في ثوانٍ';

  @override
  String get joinMovementTitle => 'انضم لحركة إنقاذ الطعام';

  @override
  String get joinMovementDesc =>
      'وفّر المال وقلّل الهدر واجعل وجباتك اليومية ذات تأثير حقيقي';

  @override
  String get appName => 'إنقاذ الطعام';

  @override
  String get accountCreatedSuccessfully => 'تم إنشاء الحساب بنجاح';

  @override
  String get loading => 'جاري التحميل...';

  @override
  String get retry => 'إعادة المحاولة';

  @override
  String get noData => 'لا توجد بيانات';

  @override
  String get error => 'حدث خطأ ما';

  @override
  String get login => 'تسجيل الدخول';

  @override
  String get signup => 'إنشاء حساب';

  @override
  String get welcome => 'أهلاً بك';

  @override
  String get loginSubtitle => 'سجّل الدخول لمكافحة هدر الطعام';

  @override
  String get createAccount => 'إنشاء حساب';

  @override
  String get createAccountSubtitle => 'انضم للمساهمة في إنقاذ الطعام';

  @override
  String get email => 'البريد الإلكتروني';

  @override
  String get emailHint => 'your@email.com';

  @override
  String get password => 'كلمة المرور';

  @override
  String get passwordHint => 'أدخل كلمة المرور';

  @override
  String get startCooking => 'ابدأ الآن';

  @override
  String get fullName => 'الاسم بالكامل';

  @override
  String get fullNameHint => 'محمد أحمد';

  @override
  String get confirmPassword => 'تأكيد كلمة المرور';

  @override
  String get phone => 'رقم الهاتف';

  @override
  String get address => 'العنوان';

  @override
  String get rememberMe => 'تذكرني';

  @override
  String get forgotPassword => 'نسيت كلمة المرور؟';

  @override
  String get forgotPasswordTitle => 'استعادة كلمة المرور';

  @override
  String get forgotPasswordSubtitle =>
      'أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور';

  @override
  String get sendResetLink => 'إرسال رابط إعادة التعيين';

  @override
  String get emailCantBeEmpty => 'البريد الإلكتروني لا يمكن أن يكون فارغًا';

  @override
  String get emailNotValid => 'البريد الإلكتروني غير صالح';

  @override
  String get passwordCantBeEmpty => 'كلمة المرور لا يمكن أن تكون فارغة';

  @override
  String get passwordAtLeast8Chars =>
      'يجب أن تكون كلمة المرور ٨ أحرف على الأقل';

  @override
  String get passwordMustContainNumber =>
      'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل';

  @override
  String get passwordMustContainUppercase =>
      'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل';

  @override
  String get passwordNotMatch => 'كلمة المرور غير متطابقة';

  @override
  String get nameCantBeEmpty => 'الاسم لا يمكن أن يكون فارغًا';

  @override
  String get nameAtLeast6Chars => 'يجب أن يكون الاسم ٦ أحرف على الأقل';

  @override
  String get phoneCantBeEmpty => 'رقم الهاتف لا يمكن أن يكون فارغًا';

  @override
  String get phoneNotValid => 'رقم الهاتف غير صالح';

  @override
  String get codeSentSuccessfully => 'تم إرسال الرمز بنجاح';

  @override
  String get sendCode => 'إرسال الكود';

  @override
  String get passwordResetedSuccessfully => 'Password reseted successfully';

  @override
  String get correctCode => 'الرمز صحيح';

  @override
  String get backToLogin => 'العودة لتسجيل الدخول';

  @override
  String get orLoginWith => 'أو سجل الدخول باستخدام';

  @override
  String get orSignupWith => 'أو أنشئ حساب باستخدام';

  @override
  String get dontHaveAccount => 'ليس لديك حساب؟ ';

  @override
  String get alreadyHaveAccount => 'لديك حساب بالفعل؟ ';

  @override
  String get resetPassword => 'إعادة تعيين كلمة المرور';

  @override
  String get resetPasswordSubtitle => 'أدخل كلمة المرور الجديدة';

  @override
  String get newPassword => 'كلمة المرور الجديدة';

  @override
  String get updatePassword => 'تحديث كلمة المرور';

  @override
  String get verifyEmail => 'تأكيد البريد الإلكتروني';

  @override
  String get verifyEmailSubtitle => 'تم إرسال كود إلى بريدك الإلكتروني';

  @override
  String get verify => 'تأكيد';

  @override
  String helloUser(Object userName) {
    return 'مرحبًا، $userName 👋';
  }

  @override
  String get searchfood => 'ابحث عن طعام...';

  @override
  String get orders => 'الطلبات';

  @override
  String get moneySpent => 'المبلغ المصروف';

  @override
  String get moneySaved => 'المبلغ المُوفَّر';

  @override
  String get allProducts => 'جميع العروض';

  @override
  String get resendCode => 'إعادة إرسال الكود';

  @override
  String get codeSent => 'تم إرسال الكود!';

  @override
  String get passwordsMatch => 'كلمتا المرور متطابقتان';

  @override
  String get containsAnUppercaseLetter => 'يحتوي على حرف كبير';

  @override
  String get containsANumber => 'يحتوي على رقم';

  @override
  String get atLeast8Characters => 'على الأقل ٨ أحرف';

  @override
  String get didntReceiveCode => 'لم تستلم الكود؟ ';

  @override
  String get navHome => 'الرئيسية';

  @override
  String get navMap => 'الخريطة';

  @override
  String get navOrders => 'الطلبات';

  @override
  String get navProfile => 'الملف الشخصي';

  @override
  String get nearbyDeals => 'عروض قريبة منك';

  @override
  String get seeAll => 'عرض الكل';

  @override
  String get noOffersNearby => 'لا توجد عروض قريبة';

  @override
  String get reserveNow => 'احجز الآن';

  @override
  String get submitReview => 'إرسال التقييم';

  @override
  String get shareYourThoughts => 'شارك رأيك...';

  @override
  String get howWasYourExperience => 'كيف كانت تجربتك؟';

  @override
  String get writeReview => 'اكتب تقييم';

  @override
  String get myActivity => 'نشاطي';

  @override
  String get myOrders => 'طلباتي';

  @override
  String get security => 'الحماية';

  @override
  String get dangerZone => 'منطقة الخطر';

  @override
  String get viewOffer => 'عرض الطلب';

  @override
  String get savedOffers => 'العروض المحفوظة';

  @override
  String get active => 'النشطة';

  @override
  String get history => 'السجل';

  @override
  String get pickupDetails => 'تفاصيل الاستلام';

  @override
  String get noHistoryOrders => 'لا توجد طلبات سابقة';

  @override
  String completedOn(Object date) {
    return 'تم الإكمال في $date';
  }

  @override
  String get noActiveOrders => 'لا توجد طلبات نشطة';

  @override
  String get unknown => 'غير معروف';

  @override
  String get statusReady => 'جاهز للاستلام';

  @override
  String get statusPreparing => 'قيد التحضير';

  @override
  String get statusCompleted => 'مكتمل';

  @override
  String get statusCancelled => 'ملغي';

  @override
  String get statusPending => 'قيد الانتظار';

  @override
  String reviewsCount(Object count) {
    return '($count تقييم)';
  }

  @override
  String get originalPrice => 'السعر الأصلي';

  @override
  String basedOnReviews(Object count) {
    return 'بناءً على $count تقييم';
  }

  @override
  String get orderConfirmed => 'تم تأكيد الطلب!';

  @override
  String get thankYouSavingFood => 'شكرًا لمساهمتك في تقليل هدر الطعام 🌱';

  @override
  String get pickupLocation => 'مكان الاستلام';

  @override
  String get pickupLocationValue => 'السوق الأخضر - 123 الشارع الرئيسي';

  @override
  String get pickupTimeValue => 'اليوم قبل الساعة 6:00 مساءً';

  @override
  String get viewMyOrders => 'عرض طلباتي';

  @override
  String get backToHome => 'العودة للرئيسية';

  @override
  String get yourPrice => 'سعرك';

  @override
  String savingsMessage(Object amount) {
    return '💰 لقد وفّرت $amount وساهمت في تقليل هدر الطعام!';
  }

  @override
  String get reviews => 'التقييمات';

  @override
  String get general => 'عام';

  @override
  String get editProfile => 'تعديل الملف الشخصي';

  @override
  String get directions => 'الاتجاهات';

  @override
  String get openingMaps => 'جاري فتح الخريطة...';

  @override
  String get generalSettings => 'الإعدادات العامة';

  @override
  String get helpSupport => 'المساعدة والدعم';

  @override
  String get logOut => 'تسجيل الخروج';

  @override
  String get guest => 'زائر';

  @override
  String get saveChanges => 'حفظ التغييرات';

  @override
  String get submitReport => 'إرسال تقرير';

  @override
  String get subject => 'الموضوع';

  @override
  String get description => 'الوصف';

  @override
  String get howCanWeHelpYou => 'كيف يمكننا مساعدتك؟';

  @override
  String get describeYourIssueOrFeedbackBelow => 'صف مشكلتك أو ملاحظاتك أدناه';

  @override
  String get brieflyDescribeTheIssue => 'صف المشكلة باختصار';

  @override
  String get provideMoreDetails => 'أدخل المزيد من التفاصيل...';

  @override
  String get notifications => 'الإشعارات';

  @override
  String get darkMode => 'الوضع الداكن';

  @override
  String get language => 'اللغة';

  @override
  String get privacyPolicy => 'سياسة الخصوصية';

  @override
  String get termsOfService => 'شروط الاستخدام';

  @override
  String get changePassword => 'تغيير كلمة المرور';

  @override
  String get deleteAccount => 'حذف الحساب';

  @override
  String get orderHistory => 'سجل الطلبات';

  @override
  String get currentOrders => 'الطلبات الحالية';

  @override
  String get pastOrders => 'الطلبات السابقة';

  @override
  String get orderDetails => 'تفاصيل الطلب';

  @override
  String get reorder => 'إعادة الطلب';

  @override
  String get trackOrder => 'تتبع الطلب';

  @override
  String get pickupTime => 'وقت الاستلام';

  @override
  String get orderTotal => 'الإجمالي';

  @override
  String get status => 'الحالة';

  @override
  String get phoneNumber => 'رقم الهاتف';

  @override
  String get phoneNumberHint => 'ادخل رقم هاتفك';

  @override
  String get reportThisVendor => 'Report This Vendor';

  @override
  String get reportVendor => 'الإبلاغ عن البائع';

  @override
  String get describeYourIssueBelow => 'صف مشكلتك أدناه';

  @override
  String get loginSuccess => 'تم تسجيل الدخول بنجاح';

  @override
  String get oldPassword => 'كلمة المرور القديمة';

  @override
  String get passwordChangedSuccessfully => 'تم تغيير كلمة المرور بنجاح';

  @override
  String get deleteAccountConfirmation =>
      'هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.';

  @override
  String get cancel => 'إلغاء';

  @override
  String get delete => 'حذف';

  @override
  String get accountDeletedSuccessfully => 'تم حذف الحساب بنجاح';

  @override
  String get pleaseRateProduct => 'الرجاء تقييم المنتج';

  @override
  String get pleaseWriteComment => 'الرجاء كتابة تعليق';

  @override
  String get deleteReview => 'حذف التقييم';

  @override
  String get deleteReviewConfirmation =>
      'هل أنت متأكد أنك تريد حذف هذا التقييم؟';

  @override
  String get logOutConfirmation => 'هل أنت متأكد من تسجيل الخروج؟';

  @override
  String get chooseLanguage => 'اختر اللغة';
}
