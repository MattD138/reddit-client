import {
  Box,
  Flex,
  Heading,
  Spacer,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import * as React from 'react';
import { FaRegCommentAlt } from 'react-icons/fa';
import { PostScore } from './PostScore';
import { PostCredit } from './PostCredit';
import { PostContentPreview } from './PostContentPreview';

export const PostCard = props => {
  const {
    type,
    title,
    author,
    selftext,
    subredditName,
    created,
    scoreStr,
    upvoteRatio,
    numComments,
    mediaEmbed,
    url,
    videoUrl,
  } = props.data;
  // console.log(
  //   type,
  //   id,
  //   permalink,
  //   title,
  //   author,
  //   selftext,
  //   subredditName,
  //   created,
  //   score,
  //   scoreStr,
  //   upvoteRatio,
  //   numComments,
  //   mediaEmbed,
  //   url,
  //   isSpoiler,
  //   isLocked
  // );

  return (
    <Box
      w="full"
      px="1"
      py="2.5"
      bg={mode('gray.50', 'gray.700')}
      shadow="base"
      rounded="md"
      transition="all 0.2s"
      _hover={{
        shadow: 'lg',
      }}
    >
      <Flex direction="row">
        <PostScore score={scoreStr} />
        <Flex direction="column" mx={{ base: '2', md: '4' }} w="full">
          <PostCredit
            author={author}
            created={created}
            subredditName={subredditName}
          />
          <Heading as="h3" size="md" mt="1" mb="2">
            {title}
          </Heading>
          <PostContentPreview
            data={{ type, selftext, url, videoUrl, mediaEmbed }}
          />
          <Spacer />
          <Flex
            wrap="wrap"
            justifyContent="space-between"
            fontSize="sm"
            textColor="gray.500"
          >
            <Box fontWeight="semibold">
              <Box as={FaRegCommentAlt} display="inline-block" me="2" />
              {numComments} comments
            </Box>
            <Box as="span">{Math.round(upvoteRatio * 100)}% upvoted</Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};
