"use client";
import { Document, Font, Image as PDFImage, Page, Polygon, StyleSheet, Svg, Text, View } from '@react-pdf/renderer';

// Register Arabic font with multiple stable sources
Font.register({
  family: 'ArabicFont',
  src: 'https://cdn.jsdelivr.net/gh/googlefonts/almarai@master/fonts/ttf/Almarai-Regular.ttf',
});

// Styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    fontFamily: 'ArabicFont',
    direction: 'rtl',
    position: 'relative',
    padding: 0, // Header should be full width
  },
  contentWrapper: {
    paddingHorizontal: 30, // Main content padding
    paddingTop: 10,
    paddingBottom: 0, // Remove extra bottom padding
  },
  header: {
    backgroundColor: '#1771B7',
    color: '#FFFFFF',
    paddingVertical: 18,
    textAlign: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.9,
  },
  redBar: {
    backgroundColor: '#CB3640',
    color: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 6,
    fontSize: 10,
    width: '100%',
  },
  issuedBySection: {
    paddingVertical: 12,
    textAlign: 'center',
  },
  issuedByText: {
    fontSize: 18,
    color: '#1771B7',
    fontWeight: 'bold',
  },
  dateRangeBox: {
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20, // Increased gap
    fontSize: 12,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20, // Increased gap
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 15,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  financialBar: {
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12, // Increased gap
    color: '#FFFFFF',
  },
  currency: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  balanceGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20, // Increased gap
  },
  balanceBox: {
    flex: 1,
    backgroundColor: '#F4F5F7',
    borderRadius: 8,
    padding: 15,
    textAlign: 'center',
  },
  balanceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  balanceDetails: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.4,
  },
  balanceValueRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  balanceIcon: {
    width: 24,
    height: 24,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  carsBox: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carsTextLeft: {
    flexDirection: 'row',
    gap: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  carsTextRight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  // FOOTER STYLE RECONSTRUCTION
  footerContainer: {
    marginTop: 'auto', // Pushes footer to bottom to make it "Full Page"
    width: '100%',
    height: 80,
    position: 'relative',
  },
  footerRedBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#CB3640',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15, // Added gap between items
    paddingLeft: '42%', // Pushed further right to avoid overlap with blue section
    paddingRight: 25,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footerBlueSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '38%',
    height: 80,
  },
  footerBlueContent: {
    position: 'absolute',
    top: 5,
    left: 15,
    width: '80%',
    height: '100%',
    justifyContent: 'center',
    textAlign: 'left',
  },
  footerBlueText: {
    fontSize: 8.5,
    fontWeight: 'bold',
    marginBottom: 1,
    color: '#FFFFFF',
  },
  footerCommIcon: {
    width: 45,
    height: 24,
  }
});

interface ReportsDocumentProps {
  reportData: any;
  t: any;
  duration: number;
  formatDate: (d: string | undefined | null) => string;
}

const ReportsDocument = ({ reportData, t, duration, formatDate }: ReportsDocumentProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Full Width */}
        <View style={styles.header}>
          <Text style={styles.title}>{reportData?.workshop?.workshopNameEnglish || 'Business Name'}</Text>
          <Text style={styles.subtitle}>{reportData?.workshop?.workshopNameArabic || 'Business Subtitle'}</Text>
        </View>

        {/* VAT and CR - Full Width */}
        <View style={styles.redBar}>
          <Text>VAT - {reportData?.workshop?.taxVatNumber || 'N/A'}</Text>
          <Text>CR - {reportData?.workshop?.crn || 'N/A'}</Text>
        </View>

        {/* Content with Padding */}
        <View style={styles.contentWrapper}>
          <View style={styles.issuedBySection}>
            <Text style={styles.issuedByText}>{t.reportIssuedBy}</Text>
          </View>

          <View style={styles.dateRangeBox}>
            <Text>{t.from} {formatDate(reportData?.range?.start)}   to {formatDate(reportData?.range?.end)}   {t.duration} : {duration} {t.days}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: '#CB3640' }]}>{t.numberOfSavedInvoices}</Text>
              <Text style={[styles.statValue, { color: '#CB3640' }]}>{reportData?.numberOfUnpaidNonPostpaidInvoices || 0}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: '#F97316' }]}>{t.numberOfPostpaidInvoices}</Text>
              <Text style={[styles.statValue, { color: '#F97316' }]}>{reportData?.numberOfUnpaidPostpaidInvoices || 0}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: '#16A34A' }]}>{t.numberOfCompletedInvoices}</Text>
              <Text style={[styles.statValue, { color: '#16A34A' }]}>{reportData?.numberOfPaidInvoices || 0}</Text>
            </View>
          </View>

          <View style={[styles.financialBar, { backgroundColor: '#1771B7' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.currency}>ر.س</Text>
              <Text style={styles.amount}>{reportData?.totalIncomeCollected?.toFixed(2) || '0.00'}</Text>
            </View>
            <Text style={styles.label}>{t.totalIncomeCollected}</Text>
          </View>

          <View style={[styles.financialBar, { backgroundColor: '#CB3640' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.currency}>ر.س</Text>
              <Text style={styles.amount}>{reportData?.totalUnpaidFinalCost?.toFixed(2) || '0.00'}</Text>
            </View>
            <Text style={styles.label}>{t.totalPostpaidAndSaved}</Text>
          </View>

          <View style={[styles.financialBar, { backgroundColor: '#959595' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.currency}>ر.س</Text>
              <Text style={styles.amount}>{reportData?.totalExpenses?.toFixed(2) || '0.00'}</Text>
            </View>
            <Text style={styles.label}>{t.totalExpensesPaid}</Text>
          </View>

          <View style={styles.balanceGrid}>
            <View style={styles.balanceBox}>
              <Text style={[styles.balanceTitle, { color: '#1771B7' }]}>{t.collectedFinancialBalance}</Text>
              <Text style={styles.balanceDetails}>{t.allIncomeCollected}</Text>
              <Text style={styles.balanceDetails}>-</Text>
              <Text style={styles.balanceDetails}>{t.allExpensesPaid}</Text>
              <View style={styles.balanceValueRow}>
                <PDFImage src={typeof window !== 'undefined' ? `${window.location.origin}/icons/green_symbol.png` : ""} style={styles.balanceIcon} />
                <Text style={[styles.balanceAmount, { color: '#1771B7' }]}>{reportData?.collectedFinancialBalance?.toFixed(2) || '0.00'}</Text>
              </View>
            </View>
            <View style={styles.balanceBox}>
              <Text style={[styles.balanceTitle, { color: '#DC2626' }]}>{t.recordedFinancialBalance}</Text>
              <Text style={styles.balanceDetails}>{t.allIncomeRecorded}</Text>
              <Text style={styles.balanceDetails}>-</Text>
              <Text style={styles.balanceDetails}>{t.allExpensesPaid}</Text>
              <View style={styles.balanceValueRow}>
                <PDFImage src={typeof window !== 'undefined' ? `${window.location.origin}/icons/red_symbol.png` : ""} style={styles.balanceIcon} />
                <Text style={[styles.balanceAmount, { color: '#DC2626' }]}>{reportData?.recordedFinancialBalance?.toFixed(2) || '0.00'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.carsBox}>
            <View style={styles.carsTextLeft}>
              <Text>{t.cars}</Text>
              <Text>{reportData?.numberOfCars || 0}</Text>
            </View>
            <Text style={styles.carsTextRight}>{t.numberOfCarsServiced}</Text>
          </View>
        </View>

        {/* Footer - Final Fixed Design (No Gap) */}
        <View style={styles.footerContainer}>
          {/* Main Red Bar */}
          <View style={styles.footerRedBar}>
            <Text style={{ color: '#FFFFFF' }}>{reportData?.workshop?.contact || 'Contact Number'}</Text>
            <PDFImage
              src={typeof window !== 'undefined' ? `${window.location.origin}/icons/footerCommunications.png` : ""}
              style={styles.footerCommIcon}
            />
            <Text style={{ color: '#FFFFFF' }}>{reportData?.workshop?.address || 'Business Address'}</Text>
          </View>

          {/* Blue Slanted Overlay */}
          <View style={styles.footerBlueSection}>
            <Svg height="100%" width="100%">
              <Polygon
                points="0,0 180,0 230,80 0,80"
                fill="#1771B7"
              />
            </Svg>
            <View style={styles.footerBlueContent}>
              <Text style={styles.footerBlueText}>{t.footerText1}</Text>
              <Text style={styles.footerBlueText}>{t.footerText2}</Text>
              <Text style={styles.footerBlueText}>{t.footerText3}</Text>
              <Text style={styles.footerBlueText}>{t.footerText4}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReportsDocument;
