import 'package:translator/translator.dart';

final translator = GoogleTranslator();

Future<String> translateMessage(String message, String targetLang) async {
  var translation = await translator.translate(message, to: targetLang);
  return translation.text;
}
