import {
  Box,
  Button,
  ContentLayout,
  Grid,
  GridItem,
  IconButton,
  Layout,
  Typography,
  Flex,
  Link
} from '@strapi/design-system';
import {ArrowLeft} from "@strapi/icons";

export const Final = () => {
  return (
    <Layout>
      <ContentLayout>
        <Box>
          <Typography>You can always review configuration under /Settings</Typography>
        </Box>

        <Box>
          <Typography>Create you first product to start selling</Typography>
        </Box>
        <Link to="/content-manager/collectionType/plugin::omcommerce.tax?page=1&pageSize=10&sort=country_code:ASC">
          Internal link
        </Link>

      </ContentLayout>

    </Layout>

  )
}
