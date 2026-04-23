import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_ar.dart';
import 'app_localizations_en.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('ar'),
    Locale('en'),
  ];

  /// No description provided for @skip.
  ///
  /// In en, this message translates to:
  /// **'Skip'**
  String get skip;

  /// No description provided for @getStarted.
  ///
  /// In en, this message translates to:
  /// **'Get Started'**
  String get getStarted;

  /// No description provided for @next.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get next;

  /// No description provided for @rescueFoodTitle.
  ///
  /// In en, this message translates to:
  /// **'Rescue Great Food'**
  String get rescueFoodTitle;

  /// No description provided for @rescueFoodDesc.
  ///
  /// In en, this message translates to:
  /// **'Find quality meals at up to 70% off while helping protect the planet.'**
  String get rescueFoodDesc;

  /// No description provided for @premiumMealsTitle.
  ///
  /// In en, this message translates to:
  /// **'Premium Meals. Better Prices.'**
  String get premiumMealsTitle;

  /// No description provided for @premiumMealsDesc.
  ///
  /// In en, this message translates to:
  /// **'Enjoy fresh, high-quality food at amazing discounts. Reserve in seconds.'**
  String get premiumMealsDesc;

  /// No description provided for @joinMovementTitle.
  ///
  /// In en, this message translates to:
  /// **'Join the Food Rescue Movement'**
  String get joinMovementTitle;

  /// No description provided for @joinMovementDesc.
  ///
  /// In en, this message translates to:
  /// **'Save money, reduce waste, and turn everyday meals into real impact.'**
  String get joinMovementDesc;

  /// No description provided for @appName.
  ///
  /// In en, this message translates to:
  /// **'Food Rescue'**
  String get appName;

  /// No description provided for @accountCreatedSuccessfully.
  ///
  /// In en, this message translates to:
  /// **'Account created successfully'**
  String get accountCreatedSuccessfully;

  /// No description provided for @loading.
  ///
  /// In en, this message translates to:
  /// **'Loading...'**
  String get loading;

  /// No description provided for @retry.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get retry;

  /// No description provided for @noData.
  ///
  /// In en, this message translates to:
  /// **'No data available'**
  String get noData;

  /// No description provided for @error.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong'**
  String get error;

  /// No description provided for @login.
  ///
  /// In en, this message translates to:
  /// **'Login'**
  String get login;

  /// No description provided for @signup.
  ///
  /// In en, this message translates to:
  /// **'Sign Up'**
  String get signup;

  /// No description provided for @welcome.
  ///
  /// In en, this message translates to:
  /// **'Welcome'**
  String get welcome;

  /// No description provided for @loginSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Login to continue fighting food waste'**
  String get loginSubtitle;

  /// No description provided for @createAccount.
  ///
  /// In en, this message translates to:
  /// **'Create Account'**
  String get createAccount;

  /// No description provided for @createAccountSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Join the movement to save food'**
  String get createAccountSubtitle;

  /// No description provided for @email.
  ///
  /// In en, this message translates to:
  /// **'Email Address'**
  String get email;

  /// No description provided for @emailHint.
  ///
  /// In en, this message translates to:
  /// **'your@email.com'**
  String get emailHint;

  /// No description provided for @password.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get password;

  /// No description provided for @passwordHint.
  ///
  /// In en, this message translates to:
  /// **'Enter Password'**
  String get passwordHint;

  /// No description provided for @startCooking.
  ///
  /// In en, this message translates to:
  /// **'Start Cooking'**
  String get startCooking;

  /// No description provided for @fullName.
  ///
  /// In en, this message translates to:
  /// **'Full Name'**
  String get fullName;

  /// No description provided for @fullNameHint.
  ///
  /// In en, this message translates to:
  /// **'John Doe'**
  String get fullNameHint;

  /// No description provided for @confirmPassword.
  ///
  /// In en, this message translates to:
  /// **'Confirm Password'**
  String get confirmPassword;

  /// No description provided for @phone.
  ///
  /// In en, this message translates to:
  /// **'Phone Number'**
  String get phone;

  /// No description provided for @address.
  ///
  /// In en, this message translates to:
  /// **'Address'**
  String get address;

  /// No description provided for @rememberMe.
  ///
  /// In en, this message translates to:
  /// **'Remember me'**
  String get rememberMe;

  /// No description provided for @forgotPassword.
  ///
  /// In en, this message translates to:
  /// **'Forgot Password?'**
  String get forgotPassword;

  /// No description provided for @forgotPasswordTitle.
  ///
  /// In en, this message translates to:
  /// **'Forgot Password'**
  String get forgotPasswordTitle;

  /// No description provided for @forgotPasswordSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Enter your email to reset your password'**
  String get forgotPasswordSubtitle;

  /// No description provided for @sendResetLink.
  ///
  /// In en, this message translates to:
  /// **'Send Reset Link'**
  String get sendResetLink;

  /// No description provided for @emailCantBeEmpty.
  ///
  /// In en, this message translates to:
  /// **'Email can\'t be empty'**
  String get emailCantBeEmpty;

  /// No description provided for @emailNotValid.
  ///
  /// In en, this message translates to:
  /// **'Email is not valid'**
  String get emailNotValid;

  /// No description provided for @passwordCantBeEmpty.
  ///
  /// In en, this message translates to:
  /// **'Password can\'t be empty'**
  String get passwordCantBeEmpty;

  /// No description provided for @passwordAtLeast8Chars.
  ///
  /// In en, this message translates to:
  /// **'Password must be at least 8 characters'**
  String get passwordAtLeast8Chars;

  /// No description provided for @passwordMustContainNumber.
  ///
  /// In en, this message translates to:
  /// **'Password must contain at least one number'**
  String get passwordMustContainNumber;

  /// No description provided for @passwordMustContainUppercase.
  ///
  /// In en, this message translates to:
  /// **'Password must contain at least one uppercase letter'**
  String get passwordMustContainUppercase;

  /// No description provided for @passwordNotMatch.
  ///
  /// In en, this message translates to:
  /// **'Password does not match'**
  String get passwordNotMatch;

  /// No description provided for @nameCantBeEmpty.
  ///
  /// In en, this message translates to:
  /// **'Name can\'t be empty'**
  String get nameCantBeEmpty;

  /// No description provided for @nameAtLeast6Chars.
  ///
  /// In en, this message translates to:
  /// **'Name must be at least 6 characters'**
  String get nameAtLeast6Chars;

  /// No description provided for @phoneCantBeEmpty.
  ///
  /// In en, this message translates to:
  /// **'Phone can\'t be empty'**
  String get phoneCantBeEmpty;

  /// No description provided for @phoneNotValid.
  ///
  /// In en, this message translates to:
  /// **'Phone number is not valid'**
  String get phoneNotValid;

  /// No description provided for @codeSentSuccessfully.
  ///
  /// In en, this message translates to:
  /// **'Code sent successfully'**
  String get codeSentSuccessfully;

  /// No description provided for @sendCode.
  ///
  /// In en, this message translates to:
  /// **'Send Code'**
  String get sendCode;

  /// No description provided for @passwordResetedSuccessfully.
  ///
  /// In en, this message translates to:
  /// **'Password reseted successfully'**
  String get passwordResetedSuccessfully;

  /// No description provided for @correctCode.
  ///
  /// In en, this message translates to:
  /// **'Correct Code'**
  String get correctCode;

  /// No description provided for @backToLogin.
  ///
  /// In en, this message translates to:
  /// **'Back to Login'**
  String get backToLogin;

  /// No description provided for @orLoginWith.
  ///
  /// In en, this message translates to:
  /// **'Or login with'**
  String get orLoginWith;

  /// No description provided for @orSignupWith.
  ///
  /// In en, this message translates to:
  /// **'Or sign up with'**
  String get orSignupWith;

  /// No description provided for @dontHaveAccount.
  ///
  /// In en, this message translates to:
  /// **'Don\'t have an account? '**
  String get dontHaveAccount;

  /// No description provided for @alreadyHaveAccount.
  ///
  /// In en, this message translates to:
  /// **'Already have an account? '**
  String get alreadyHaveAccount;

  /// No description provided for @resetPassword.
  ///
  /// In en, this message translates to:
  /// **'Reset Password'**
  String get resetPassword;

  /// No description provided for @resetPasswordSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Enter your new password below'**
  String get resetPasswordSubtitle;

  /// No description provided for @newPassword.
  ///
  /// In en, this message translates to:
  /// **'New Password'**
  String get newPassword;

  /// No description provided for @updatePassword.
  ///
  /// In en, this message translates to:
  /// **'Update Password'**
  String get updatePassword;

  /// No description provided for @verifyEmail.
  ///
  /// In en, this message translates to:
  /// **'Verify Email'**
  String get verifyEmail;

  /// No description provided for @verifyEmailSubtitle.
  ///
  /// In en, this message translates to:
  /// **'We\'ve sent a code to your email'**
  String get verifyEmailSubtitle;

  /// No description provided for @verify.
  ///
  /// In en, this message translates to:
  /// **'Verify'**
  String get verify;

  /// No description provided for @helloUser.
  ///
  /// In en, this message translates to:
  /// **'Hello, {userName} 👋'**
  String helloUser(Object userName);

  /// No description provided for @searchfood.
  ///
  /// In en, this message translates to:
  /// **'Search foods...'**
  String get searchfood;

  /// No description provided for @orders.
  ///
  /// In en, this message translates to:
  /// **'Orders'**
  String get orders;

  /// No description provided for @moneySpent.
  ///
  /// In en, this message translates to:
  /// **'Money Spent'**
  String get moneySpent;

  /// No description provided for @moneySaved.
  ///
  /// In en, this message translates to:
  /// **'Money Saved'**
  String get moneySaved;

  /// No description provided for @allProducts.
  ///
  /// In en, this message translates to:
  /// **'All Products'**
  String get allProducts;

  /// No description provided for @resendCode.
  ///
  /// In en, this message translates to:
  /// **'Resend Code'**
  String get resendCode;

  /// No description provided for @codeSent.
  ///
  /// In en, this message translates to:
  /// **'Code sent!'**
  String get codeSent;

  /// No description provided for @passwordsMatch.
  ///
  /// In en, this message translates to:
  /// **'Passwords match'**
  String get passwordsMatch;

  /// No description provided for @containsAnUppercaseLetter.
  ///
  /// In en, this message translates to:
  /// **'Contains an uppercase letter'**
  String get containsAnUppercaseLetter;

  /// No description provided for @containsANumber.
  ///
  /// In en, this message translates to:
  /// **'Contains a number'**
  String get containsANumber;

  /// No description provided for @atLeast8Characters.
  ///
  /// In en, this message translates to:
  /// **'At least 8 characters'**
  String get atLeast8Characters;

  /// No description provided for @didntReceiveCode.
  ///
  /// In en, this message translates to:
  /// **'Didn\'t receive code? '**
  String get didntReceiveCode;

  /// No description provided for @navHome.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get navHome;

  /// No description provided for @navMap.
  ///
  /// In en, this message translates to:
  /// **'Map'**
  String get navMap;

  /// No description provided for @navOrders.
  ///
  /// In en, this message translates to:
  /// **'Orders'**
  String get navOrders;

  /// No description provided for @navProfile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get navProfile;

  /// No description provided for @nearbyDeals.
  ///
  /// In en, this message translates to:
  /// **'Nearby Deals'**
  String get nearbyDeals;

  /// No description provided for @seeAll.
  ///
  /// In en, this message translates to:
  /// **'See All'**
  String get seeAll;

  /// No description provided for @noOffersNearby.
  ///
  /// In en, this message translates to:
  /// **'No offers found nearby.'**
  String get noOffersNearby;

  /// No description provided for @reserveNow.
  ///
  /// In en, this message translates to:
  /// **'Reserve Now.'**
  String get reserveNow;

  /// No description provided for @submitReview.
  ///
  /// In en, this message translates to:
  /// **'Submit Review'**
  String get submitReview;

  /// No description provided for @shareYourThoughts.
  ///
  /// In en, this message translates to:
  /// **'Share your thoughts...'**
  String get shareYourThoughts;

  /// No description provided for @howWasYourExperience.
  ///
  /// In en, this message translates to:
  /// **'How was your experience?'**
  String get howWasYourExperience;

  /// No description provided for @writeReview.
  ///
  /// In en, this message translates to:
  /// **'Write a Review'**
  String get writeReview;

  /// No description provided for @myActivity.
  ///
  /// In en, this message translates to:
  /// **'My Activity'**
  String get myActivity;

  /// No description provided for @myOrders.
  ///
  /// In en, this message translates to:
  /// **'My Orders'**
  String get myOrders;

  /// No description provided for @security.
  ///
  /// In en, this message translates to:
  /// **'Security'**
  String get security;

  /// No description provided for @dangerZone.
  ///
  /// In en, this message translates to:
  /// **'Danger Zone'**
  String get dangerZone;

  /// No description provided for @viewOffer.
  ///
  /// In en, this message translates to:
  /// **'View Offer'**
  String get viewOffer;

  /// No description provided for @savedOffers.
  ///
  /// In en, this message translates to:
  /// **'Saved Offers'**
  String get savedOffers;

  /// No description provided for @active.
  ///
  /// In en, this message translates to:
  /// **'Active'**
  String get active;

  /// No description provided for @history.
  ///
  /// In en, this message translates to:
  /// **'History'**
  String get history;

  /// No description provided for @pickupDetails.
  ///
  /// In en, this message translates to:
  /// **'Pickup Details'**
  String get pickupDetails;

  /// No description provided for @noHistoryOrders.
  ///
  /// In en, this message translates to:
  /// **'No History Orders'**
  String get noHistoryOrders;

  /// No description provided for @completedOn.
  ///
  /// In en, this message translates to:
  /// **'Completed on {date}'**
  String completedOn(Object date);

  /// No description provided for @noActiveOrders.
  ///
  /// In en, this message translates to:
  /// **'No Active Orders'**
  String get noActiveOrders;

  /// No description provided for @unknown.
  ///
  /// In en, this message translates to:
  /// **'Unknown'**
  String get unknown;

  /// No description provided for @statusReady.
  ///
  /// In en, this message translates to:
  /// **'Ready for Pickup'**
  String get statusReady;

  /// No description provided for @statusPreparing.
  ///
  /// In en, this message translates to:
  /// **'Being Prepared'**
  String get statusPreparing;

  /// No description provided for @statusCompleted.
  ///
  /// In en, this message translates to:
  /// **'Completed'**
  String get statusCompleted;

  /// No description provided for @statusCancelled.
  ///
  /// In en, this message translates to:
  /// **'Cancelled'**
  String get statusCancelled;

  /// No description provided for @statusPending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get statusPending;

  /// No description provided for @reviewsCount.
  ///
  /// In en, this message translates to:
  /// **'({count} reviews)'**
  String reviewsCount(Object count);

  /// No description provided for @originalPrice.
  ///
  /// In en, this message translates to:
  /// **'Original Price'**
  String get originalPrice;

  /// No description provided for @basedOnReviews.
  ///
  /// In en, this message translates to:
  /// **'Based on {count} reviews'**
  String basedOnReviews(Object count);

  /// No description provided for @orderConfirmed.
  ///
  /// In en, this message translates to:
  /// **'Order Confirmed!'**
  String get orderConfirmed;

  /// No description provided for @thankYouSavingFood.
  ///
  /// In en, this message translates to:
  /// **'Thank you for saving food! 🌱'**
  String get thankYouSavingFood;

  /// No description provided for @pickupLocation.
  ///
  /// In en, this message translates to:
  /// **'Pickup Location'**
  String get pickupLocation;

  /// No description provided for @pickupLocationValue.
  ///
  /// In en, this message translates to:
  /// **'Green Market - 123 Main St'**
  String get pickupLocationValue;

  /// No description provided for @pickupTimeValue.
  ///
  /// In en, this message translates to:
  /// **'Today before 6:00 PM'**
  String get pickupTimeValue;

  /// No description provided for @viewMyOrders.
  ///
  /// In en, this message translates to:
  /// **'View My Orders'**
  String get viewMyOrders;

  /// No description provided for @backToHome.
  ///
  /// In en, this message translates to:
  /// **'Back to Home'**
  String get backToHome;

  /// No description provided for @yourPrice.
  ///
  /// In en, this message translates to:
  /// **'Your Price'**
  String get yourPrice;

  /// No description provided for @savingsMessage.
  ///
  /// In en, this message translates to:
  /// **'💰 You save {amount} and help reduce food waste!'**
  String savingsMessage(Object amount);

  /// No description provided for @reviews.
  ///
  /// In en, this message translates to:
  /// **'Reviews'**
  String get reviews;

  /// No description provided for @general.
  ///
  /// In en, this message translates to:
  /// **'General'**
  String get general;

  /// No description provided for @editProfile.
  ///
  /// In en, this message translates to:
  /// **'Edit Profile'**
  String get editProfile;

  /// No description provided for @directions.
  ///
  /// In en, this message translates to:
  /// **'Directions'**
  String get directions;

  /// No description provided for @openingMaps.
  ///
  /// In en, this message translates to:
  /// **'Opening Map...'**
  String get openingMaps;

  /// No description provided for @generalSettings.
  ///
  /// In en, this message translates to:
  /// **'General Settings'**
  String get generalSettings;

  /// No description provided for @helpSupport.
  ///
  /// In en, this message translates to:
  /// **'Help & Support'**
  String get helpSupport;

  /// No description provided for @logOut.
  ///
  /// In en, this message translates to:
  /// **'Log Out'**
  String get logOut;

  /// No description provided for @guest.
  ///
  /// In en, this message translates to:
  /// **'Guest'**
  String get guest;

  /// No description provided for @saveChanges.
  ///
  /// In en, this message translates to:
  /// **'Save Changes'**
  String get saveChanges;

  /// No description provided for @submitReport.
  ///
  /// In en, this message translates to:
  /// **'Submit Report'**
  String get submitReport;

  /// No description provided for @subject.
  ///
  /// In en, this message translates to:
  /// **'Subject'**
  String get subject;

  /// No description provided for @description.
  ///
  /// In en, this message translates to:
  /// **'Description'**
  String get description;

  /// No description provided for @howCanWeHelpYou.
  ///
  /// In en, this message translates to:
  /// **'How can we help you?'**
  String get howCanWeHelpYou;

  /// No description provided for @describeYourIssueOrFeedbackBelow.
  ///
  /// In en, this message translates to:
  /// **'Describe your issue or feedback below.'**
  String get describeYourIssueOrFeedbackBelow;

  /// No description provided for @brieflyDescribeTheIssue.
  ///
  /// In en, this message translates to:
  /// **'Briefly describe the issue'**
  String get brieflyDescribeTheIssue;

  /// No description provided for @provideMoreDetails.
  ///
  /// In en, this message translates to:
  /// **'Provide more details...'**
  String get provideMoreDetails;

  /// No description provided for @notifications.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get notifications;

  /// No description provided for @darkMode.
  ///
  /// In en, this message translates to:
  /// **'Dark Mode'**
  String get darkMode;

  /// No description provided for @language.
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get language;

  /// No description provided for @privacyPolicy.
  ///
  /// In en, this message translates to:
  /// **'Privacy Policy'**
  String get privacyPolicy;

  /// No description provided for @termsOfService.
  ///
  /// In en, this message translates to:
  /// **'Terms of Service'**
  String get termsOfService;

  /// No description provided for @changePassword.
  ///
  /// In en, this message translates to:
  /// **'Change Password'**
  String get changePassword;

  /// No description provided for @deleteAccount.
  ///
  /// In en, this message translates to:
  /// **'Delete Account'**
  String get deleteAccount;

  /// No description provided for @orderHistory.
  ///
  /// In en, this message translates to:
  /// **'Order History'**
  String get orderHistory;

  /// No description provided for @currentOrders.
  ///
  /// In en, this message translates to:
  /// **'Current Orders'**
  String get currentOrders;

  /// No description provided for @pastOrders.
  ///
  /// In en, this message translates to:
  /// **'Past Orders'**
  String get pastOrders;

  /// No description provided for @orderDetails.
  ///
  /// In en, this message translates to:
  /// **'Order Details'**
  String get orderDetails;

  /// No description provided for @reorder.
  ///
  /// In en, this message translates to:
  /// **'Reorder'**
  String get reorder;

  /// No description provided for @trackOrder.
  ///
  /// In en, this message translates to:
  /// **'Track Order'**
  String get trackOrder;

  /// No description provided for @pickupTime.
  ///
  /// In en, this message translates to:
  /// **'Pickup Time'**
  String get pickupTime;

  /// No description provided for @orderTotal.
  ///
  /// In en, this message translates to:
  /// **'Total'**
  String get orderTotal;

  /// No description provided for @status.
  ///
  /// In en, this message translates to:
  /// **'Status'**
  String get status;

  /// No description provided for @phoneNumber.
  ///
  /// In en, this message translates to:
  /// **'Phone Number'**
  String get phoneNumber;

  /// No description provided for @phoneNumberHint.
  ///
  /// In en, this message translates to:
  /// **'Enter your phone number '**
  String get phoneNumberHint;

  /// No description provided for @reportThisVendor.
  ///
  /// In en, this message translates to:
  /// **'Report This Vendor'**
  String get reportThisVendor;

  /// No description provided for @reportVendor.
  ///
  /// In en, this message translates to:
  /// **'Report Vendor'**
  String get reportVendor;

  /// No description provided for @describeYourIssueBelow.
  ///
  /// In en, this message translates to:
  /// **'Describe your issue below.'**
  String get describeYourIssueBelow;

  /// No description provided for @loginSuccess.
  ///
  /// In en, this message translates to:
  /// **'Login successful'**
  String get loginSuccess;

  /// No description provided for @oldPassword.
  ///
  /// In en, this message translates to:
  /// **'Old Password'**
  String get oldPassword;

  /// No description provided for @passwordChangedSuccessfully.
  ///
  /// In en, this message translates to:
  /// **'Password changed successfully'**
  String get passwordChangedSuccessfully;

  /// No description provided for @deleteAccountConfirmation.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to delete your account? This action cannot be undone.'**
  String get deleteAccountConfirmation;

  /// No description provided for @cancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;

  /// No description provided for @delete.
  ///
  /// In en, this message translates to:
  /// **'Delete'**
  String get delete;

  /// No description provided for @accountDeletedSuccessfully.
  ///
  /// In en, this message translates to:
  /// **'Account deleted successfully'**
  String get accountDeletedSuccessfully;

  /// No description provided for @pleaseRateProduct.
  ///
  /// In en, this message translates to:
  /// **'Please rate the product'**
  String get pleaseRateProduct;

  /// No description provided for @pleaseWriteComment.
  ///
  /// In en, this message translates to:
  /// **'Please write a comment'**
  String get pleaseWriteComment;

  /// No description provided for @deleteReview.
  ///
  /// In en, this message translates to:
  /// **'Delete Review'**
  String get deleteReview;

  /// No description provided for @deleteReviewConfirmation.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to delete this review?'**
  String get deleteReviewConfirmation;

  /// No description provided for @logOutConfirmation.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to log out?'**
  String get logOutConfirmation;

  /// No description provided for @chooseLanguage.
  ///
  /// In en, this message translates to:
  /// **'Choose Language'**
  String get chooseLanguage;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['ar', 'en'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ar':
      return AppLocalizationsAr();
    case 'en':
      return AppLocalizationsEn();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
