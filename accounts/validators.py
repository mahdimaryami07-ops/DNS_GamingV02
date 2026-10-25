import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class CyberpunkPasswordValidator:
    """اعتبارسنجی امنیتی رمز عبور برای پلتفرم گیمینگ"""
    def validate(self, password, user=None):
        if len(password) < 8:
            raise ValidationError(_("رمز عبور بایدحداقل ۸ کاراکتر باشد."))
        if not re.search(r'[A-Z]', password):
            raise ValidationError(_("رمز عبور باید حداقل شامل یک حرف بزرگ لاتین (A-Z) باشد."))
        if not re.search(r'[a-z]', password):
            raise ValidationError(_("رمز عبور باید حداقل شامل یک حرف کوچک لاتین (a-z) باشد."))
        if not re.search(r'[0-9]', password):
            raise ValidationError(_("رمز عبور باید حداقل شامل یک عدد (0-9) باشد."))
        if not re.search(r'[@$!%*?&._#]', password):
            raise ValidationError(_("رمز عبور باید حداقل شامل یک نماد یا کاراکتر خاص (مثل @, $, !, %, ?) باشد."))

    def get_help_text(self):
        return _("رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ و کوچک، عدد و نماد باشد.")