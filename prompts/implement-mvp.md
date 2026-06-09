# Codex Prompt: Onaylı MVP Dilimini Uygulama

Mimari analiz ve ilgili ADR'ler onaylandıktan sonra kullan:

```text
implementation_worker ajanını oluştur ve aşağıdaki onaylı MVP işini uygulat:

HEDEF:
[Buraya tek ve sınırlandırılmış iş yazılacak.]

BAĞLAM:
- İlgili analiz bölümü: [dosya ve başlık]
- İlgili ADR'ler: [dosyalar]
- Etkilenen paketler: [paketler]
- Mevcut örnek/testler: [dosyalar]

KISITLAR:
- Framework-independent core sınırını koru.
- Strict TypeScript ve public generic inference kalitesini koru.
- CSS tarafında düşük specificity, custom properties ve stable slot sözleşmesini koru.
- Responsive, keyboard ve screen-reader davranışlarını bozma.
- Yeni production dependency ekleme; zorunluysa önce gerekçe ve alternatif sun.
- İlgisiz refactor yapma.

BİTTİ SAYILMASI İÇİN:
- [Davranış kabul kriteri]
- [TypeScript kabul kriteri]
- [CSS/responsive kabul kriteri]
- [Accessibility kabul kriteri]
- [Test/build kabul kriteri]

Ajan tamamlandığında değişen dosyaları, çalıştırılan kontrolleri, atlanan kontrolleri ve kalan riskleri raporla. Ardından quality_security_specialist ve accessibility_specialist ajanlarını salt-okunur inceleme için paralel oluştur; bulguları birleştir ve gerçek hata varsa implementation_worker ile düzelt.
```
