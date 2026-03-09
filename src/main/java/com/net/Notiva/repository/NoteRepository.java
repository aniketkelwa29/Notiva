package com.net.Notiva.repository;

import com.net.Notiva.entity.Note;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository  extends MongoRepository<Note,String> {
List<Note>findByUserId(String userId);
}
