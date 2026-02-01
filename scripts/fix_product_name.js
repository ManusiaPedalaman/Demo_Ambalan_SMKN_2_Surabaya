
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Finding product with name "Tenda Segitiga/Kerucut"...');
  const product = await prisma.dataProdukTersedia.findFirst({
    where: { nama_produk: 'Tenda Segitiga/Kerucut' },
  });

  if (product) {
    console.log('Found product:', product);
    console.log('Updating name to "Tenda Prisma"...');
    await prisma.dataProdukTersedia.update({
      where: { id_produk: product.id_produk },
      data: { nama_produk: 'Tenda Prisma' },
    });
    console.log('Product name updated successfully.');
  } else {
    console.log('Product "Tenda Segitiga/Kerucut" not found. Checking if "Tenda Prisma" already exists...');
    const prismaProduct = await prisma.dataProdukTersedia.findFirst({
        where: { nama_produk: 'Tenda Prisma' },
    });
    if (prismaProduct) {
        console.log('Product "Tenda Prisma" already exists.');
    } else {
        console.log('Product not found.');
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
